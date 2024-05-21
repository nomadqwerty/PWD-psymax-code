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
const { SubscriptionPlans } = require('../../utils/constants');
const { UserSchema } = require('../../models/userModel');

// Define user subscription schema
const wireTransferSchema = new mongoose.Schema({
  given_name: String,
  family_name: String,
  email: String,
  amount: Number,
  lastPaymentDate: Date,
  subscriptionActive: { type: Boolean, default: true }, // Added field for tracking subscription status
});
const WireTransfer = mongoose.model('WireTransfer', wireTransferSchema);

// Initialize Bull queue
const subscriptionQueue = new Queue('subscription');

// Job processors
// subscriptionQueue.process('addUserToQueue', async (job) => {
//   const userData = job.data;
//   // Add user to queue logic here
//   console.log(`Added user ${userData.name} to subscription queue.`);
//   // Save user to database
//   await WireTransfer.create(userData);
// });

subscriptionQueue.process('paymentNotification', async () => {
  // Payment notification logic here
  console.log('Sending payment notification...');
  // Retrieve users whose payment is due and whose subscription is active
  const users = await WireTransfer.find({
    lastPaymentDate: { $lt: dayjs().subtract(28, 'days').toDate() },
    subscriptionActive: true,
  });
  // Send email notification to each user
  users.forEach((user) => {
    sendPaymentNotification(user.email);
  });
});

async function cancelSubscription(userId) {
  // Cancel subscription logic here
  console.log(`Cancelling subscription for user with ID: ${userId}`);
  const user = await WireTransfer.findById(userId);
  if (user) {
    const remainingDays = dayjs().diff(dayjs(user.lastPaymentDate), 'days');
    const nextPaymentDate = dayjs().add(remainingDays, 'days').toDate();
    const subscription = await WireTransfer.findByIdAndUpdate(userId, {
      subscriptionActive: false,
      lastPaymentDate: nextPaymentDate,
    });
    return subscription;
  }
}

// Function to schedule payment notifications every 28 days
function schedulePaymentNotifications() {
  subscriptionQueue.add(
    'paymentNotification',
    {},
    { repeat: { cron: '0 0 */28 * *' } }
  );
}
// Function to send payment notification email
async function sendPaymentNotification(email) {
  const pdfsFolderPath = path.join('public', 'pdfs');

  const pdfName = `psymax_reminder_order_${Date.now()}.pdf`;
  const pdfFilePath = pdfsFolderPath + pdfName;

  let htmlTemplate = fs.readFileSync(
    path.join('html', 'pdfs', 'invoice-reminder.html'),
    'utf-8'
  );

  await generatePDF(htmlTemplate, pdfName, pdfFilePath);

  // create the pdf into a buffer
  const attachments = [
    {
      filename: pdfName,
      path: pdfFilePath,
    },
  ];
  // Send email
  sendSMTPMail(
    email,
    'Subscription Payment Reminder',
    'Your subscription payment is due. Please make the payment to continue enjoying our service.',
    attachments
  )
    .then(() => {
      if (fs.existsSync(pdfFilePath)) {
        fs.unlinkSync(pdfFilePath);
      }
    })
    .catch((error) => {
      console.log('There was an error sending mail', error);
    });
}

class WireTransferProvider {
  // Function to cancel subscription for a user
  async cancelSubscription(userId) {
    return await cancelSubscription(userId);
  }

  // Function to query user's subscription information
  async getUserSubscription(userId) {
    const subscription = await WireTransfer.findById(userId);
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
      subscriptionActive: subscription.subscriptionActive,
    };
  }

  // Function to add user to subscription queue
  async createSubscription(amount, userData) {
    // await subscriptionQueue.add('addUserToQueue', userData);

    // const userData = job.data;
    // Add user to queue logic here
    // console.log(`Added user ${userData.name} to subscription queue.`);
    // Save user to database
    const subscription = await WireTransfer.create({ ...userData, amount });
    // Send invoice email
    const payload = {
      id: subscription.id,
      dateCreated: dayjs().format('DD.MM.YYYY'),
      endDate: dayjs().add(28, 'days').format('DD.MM.YYYY'),
    };
    sendInvoiceEmail(subscription.email, payload);
    return subscription;
  }
}

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

  const { pricing_noVat, pricing, vatPercentage } = getPlanInfo(
    SubscriptionPlans.GLOBAL
  );

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

// Example usage
// const newUser = { name: 'John', email: 'john@example.com', paymentMethod: 'wire transfer', lastPaymentDate: new Date(), subscriptionActive: true };
// addUserToQueue(newUser);
// schedulePaymentNotifications();

// Example cancellation
// const userIdToCancel = 'userIdToCancel';
// cancelSubscription(userIdToCancel);

// Example querying user subscription info
// const userIdToQuery = 'userIdToQuery';
// const userSubscriptionInfo = await getUserSubscription(userIdToQuery);
// console.log(userSubscriptionInfo);

module.exports = {
  schedulePaymentNotifications,
  // addUserToQueue,
  WireTransferProvider,
};
