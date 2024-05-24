const Queue = require('bull');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const {
  sendSMTPMail,
  generatePDF,
  getPlanInfo,
} = require('../../utils/common');
const { UserSchema } = require('../../models/userModel');
const { DAYS_PER_CYCLE, SubscriptionPlans } = require('../../utils/constants');

const wireTransferSchema = new mongoose.Schema({
  given_name: String,
  family_name: String,
  email: String,
  amount: Number,
  plan: {
    type: String,
    enum: Object.values(SubscriptionPlans),
    required: true,
  },
  lastPaymentDate: Date,
  userId: mongoose.Schema.Types.ObjectId,
  status: {
    type: String,
    enum: ['active', 'canceled', 'cancelling'],
    default: 'active',
  },
});
const WireTransfer = mongoose.model('WireTransfer', wireTransferSchema);

// Function to send invoice email
async function sendInvoiceEmail(email, invoice) {
  const pdfsFolderPath = path.join('public', 'pdfs');

  const pdfName = `psymax_order_${Date.now()}.pdf`;
  const pdfFilePath = pdfsFolderPath + pdfName;
  const user = await UserSchema.findOne({ email });
  if (!user)
    throw new Error('Trying to send wire invoice to non existing user');

  let htmlTemplate = fs.readFileSync(
    path.join('html', 'pdfs', 'invoice-wire.html'),
    'utf-8'
  );

  htmlTemplate = htmlTemplate
    .replace(/{{Titel}}/g, user?.Titel)
    .replace(/{{Vorname}}/g, user?.Vorname)
    .replace(/{{Nachname}}/g, user?.Nachname)
    // .replace(/{{Firma}}/g, user?.Firma)
    .replace(/{{Strasse_und_Hausnummer}}/g, user?.Strasse_und_Hausnummer)
    .replace(/{{PLZ}}/g, user?.PLZ)
    .replace(/{{Ort}}/g, user?.Ort);

  htmlTemplate = htmlTemplate
    .replace(/{{InvoiceNumber}}/g, invoice?.id)
    .replace(/{{InvoiceDate}}/g, invoice?.dateCreated)
    .replace(/{{SubscriptionEndDate}}/g, invoice?.endDate)
    .replace(/{{userid}}/g, user?.id);

  const { pricing_noVat, pricing, vatPercentage } = getPlanInfo(invoice.plan);

  htmlTemplate = htmlTemplate
    .replace(/{{Price_noVat}}/g, pricing_noVat.toLocaleString())
    .replace(/{{VAT}}/g, vatPercentage * 100)
    .replace(/{{Total}}/g, pricing.toLocaleString());

  // htmlTemplate = htmlTemplate
  //   .replace(/{{IBAN}}/g, pricing_noVat.toLocaleString())
  //   .replace(/{{Bank}}/g, vatPercentage * 100)
  //   .replace(/{{BIC}}/g, pricing.toLocaleString());

  await generatePDF(htmlTemplate, pdfName, pdfFilePath);

  // create the pdf into a buffer
  const attachments = [
    {
      filename: pdfName,
      path: pdfFilePath,
    },
  ];
  // Create and send invoice email logic here
  sendSMTPMail(
    email,
    'Subscription Invoice',
    'Thank you for subscribing. Below is your invoice.',
    attachments
  )
    .then(() => {
      if (fs.existsSync(pdfFilePath)) {
        fs.unlinkSync(pdfFilePath);
      }
    })
    .catch((error) => {
      console.log('There was an error sending invoice email', error);
    });
}

// Create a Bull queue for invoice emails
const invoiceQueue = new Queue('invoice', {
  redis: {
    host: '127.0.0.1', // Adjust the host and port as needed
    port: 6379,
  },
});

// invoiceQueue.clean(0);
invoiceQueue.empty();

// Process jobs in the invoice queue
invoiceQueue.process(async (job) => {
  const { id, email, invoice } = job.data;

  try {
    // Fetch the latest subscription data
    const subscription = await WireTransfer.findById(id);

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    invoice.plan = subscription.plan;
    // Send the invoice email
    await sendInvoiceEmail(email, invoice);

    // Check if the subscription is in 'cancelling' status
    if (subscription.status === 'cancelling') {
      // Mark the subscription as 'canceled'
      subscription.status = 'canceled';
      await subscription.save();

      // Remove any recurring invoice jobs for the user
      await invoiceQueue.removeRepeatableByKey(`invoice:${id}`);

      console.log(
        `Final invoice sent and subscription canceled for user ${subscription.userId}`
      );
    } else {
      console.log(`Invoice sent to user ${subscription.userId}`);
    }
  } catch (error) {
    console.error('Error processing invoice job:', error);
  }
});

function scheduleInvoice(id, userId, email, invoice) {
  // Schedule the initial invoice immediately
  invoiceQueue.add({ id, email, invoice }, { delay: 0 });

  // Schedule recurring invoices every 30 days
  invoiceQueue.add(
    { id, email, invoice },
    {
      // repeat: { every: 60 * 1000 }, // 28 days in milliseconds
      repeat: { every: DAYS_PER_CYCLE * 24 * 60 * 60 * 1000 }, // 28 days in milliseconds
      jobId: `invoice:${userId}`, // Unique job ID for each user's recurring job
    }
  );
}

async function cancelSubscription(id) {
  try {
    // Find the subscription for the user
    const subscription = await WireTransfer.findById(id);

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const remainingDays = dayjs().diff(
      dayjs(subscription.lastPaymentDate),
      'days'
    );
    const nextPaymentDate = dayjs().add(remainingDays, 'days').toDate();

    // Update subscription status to 'cancelling'
    subscription.status = 'cancelling';
    subscription.lastPaymentDate = nextPaymentDate;
    await subscription.save();

    console.log(
      'Subscription cancellation requested. You will receive one final invoice.'
    );
  } catch (error) {
    console.error('Error requesting subscription cancellation:', error);
    throw error;
  }
}

class WireTransferProvider {
  // Function to cancel subscription for a user
  async cancelSubscription(id) {
    return await cancelSubscription(id);
  }

  // Function to query user's subscription information
  async getSubscription(id) {
    const subscription = await WireTransfer.findById(id);
    if (!subscription) return null;

    // Calculate subscription dates
    const startDate = subscription.lastPaymentDate;
    const endDate = dayjs(startDate).add(28, 'days').toDate();
    const nextPaymentDate = dayjs(startDate).add(56, 'days').toDate(); // Assuming a 28-day cycle

    return {
      startDate,
      endDate,
      nextChargeDate: nextPaymentDate,
      lastPaymentDate: subscription.lastPaymentDate,
      subscriptionActive: subscription.status === 'active',
    };
  }

  // Function to add user to subscription queue
  async createSubscription(amount, userData) {
    const subscription = await WireTransfer.create({ ...userData, amount });
    const payload = {
      id: subscription.id,
      dateCreated: dayjs().format('DD.MM.YYYY'),
      endDate: dayjs().add(28, 'days').format('DD.MM.YYYY'),
    };
    scheduleInvoice(subscription.id, userData.userId, userData.email, payload);
    return subscription;
  }

  // Function to update subscription details
  async updateSubscription(id, updatedData) {
    try {
      const subscription = await WireTransfer.findById(id);

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // Update the subscription fields with the new data
      if (updatedData.amount !== undefined) {
        subscription.amount = updatedData.amount;
      }
      if (updatedData.plan !== undefined) {
        subscription.plan = updatedData.plan;
      }

      // Save the updated subscription
      await subscription.save();

      console.log(`Subscription updated for user ${subscription.userId}`);

      return subscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // TODO: create handlers after wire transfer confirmation from user
  async confirmSubscription() {
    throw new Error('Not implemented');
  }
}

module.exports = { invoiceQueue, WireTransferProvider };
