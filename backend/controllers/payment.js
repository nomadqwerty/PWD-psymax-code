const path = require('path');
const fs = require('fs');

const { ProviderCallbackError } = require('../payment/providers/base');
const { PaymentMethod } = require('@mollie/api-client');
const createPaymentService = require('../payment/services/payment');
const Joi = require('joi');
const { SubscriptionSchema } = require('../models/subscriptionModel');
const dayjs = require('dayjs');
const { generatePDF, getPlanInfo } = require('../utils/common');
const { globalPricing } = require('../config');
const { InvoiceSchema } = require('../models/invoiceModel');
const { UserSchema } = require('../models/userModel');
const {
  SubscriptionStatusTracking,
  PaymentMethods,
} = require('../utils/constants');

const paymentService = createPaymentService();
/**
 * @type {import('express').Handler}
 */
async function makePayment(req, res, next) {
  const { cardToken } = req.body;
  let url = null;

  try {
    // let t = await paymentService.processPayment(
    let t = await paymentService.processPayment(
      90,
      cardToken,
      'EUR',
      PaymentMethod.creditcard
    );
    url = t.paymentUrl;
    console.log('URL is', url);
  } catch (e) {
    next(e);
    // return { message: e };
  }

  console.log('red is', url);
  if (url) res.redirect(url);
}

/**
 * @type {import('express').Handler}
 */
async function makeSubscription(req, res, next) {
  const subscriptionData = req.body;
  const userId = req.user.user_id;
  const { payment_method } = req.body;

  // TODO: Validation on card fields

  const subscriptionSchema = Joi.object({
    iban: Joi.string().required(),
    given_name: Joi.string().required(),
    family_name: Joi.string().required(),
    address_line1: Joi.string().required(),
    postal_code: Joi.string().required(),
    city: Joi.string().required(),
    country_code: Joi.string().required(),
    email: Joi.string().email().required(),
    account_holder_name: Joi.string().required(),
    payment_method: Joi.string()
      .valid(...Object.values(PaymentMethods))
      .required(),
  });

  const { error } = subscriptionSchema.validate(req.body);

  if (error) {
    let response = {
      status_code: 400,
      message: error?.details[0]?.message,
      data: error,
    };
    return res.status(400).send(response);
  }

  try {
    // Check if user has an active subscription
    const existingSubscription = await SubscriptionSchema.findOne({
      userId,
      // status: 'active',
    });
    if (existingSubscription) {
      return res
        .status(400)
        .json({ message: 'User already has an active subscription' });
    }

    let subscription = await paymentService.createSubscription(
      globalPricing,
      subscriptionData,
      'Global Payment'
    );

    const user = await UserSchema.findById(userId);
    const referrer = await UserSchema.findById(user?.invitedUserId);

    let status = referrer
      ? referrer.isAdmin
        ? SubscriptionStatusTracking.SPONSORED
        : SubscriptionStatusTracking.ENDORSED
      : SubscriptionStatusTracking.SUBSCRIBED; // SubscriptionStatusTracking.TRIAL;

    // Create new subscription
    const newSubscription = new SubscriptionSchema({
      userId,
      startDate: new Date(),
      endDate: dayjs().add(30, 'days').toDate(),
      subscriptionId: subscription.id,
      paymentMethod: payment_method,
      statusTracking: status,
      paidCyclesCount: payment_method === PaymentMethods.DIRECT_DEBIT ? 1 : 0,
    });

    // Save subscription to database
    await newSubscription.save();

    // Update user, revoke any active free trials date
    await UserSchema.findByIdAndUpdate(userId, {
      // subscriptionEnd: newSubscription.endDate,
      trialPeriodActive: false,
      trialEnd: dayjs().startOf('day'),
      trialDays: 0,
    });
    res.json({
      message: 'Subscription activated successfully',
      redirectUrl: subscription.paymentUrl,
    });
  } catch (e) {
    // next(e);
    console.error('THEY SAID ERROR', e);
    res.status(500).json({ message: 'Server Error' });
  }

  // console.log('red is', url);
  // if (url) res.redirect(url);
}

async function getPaymentStatus(id) {
  return await paymentService.getPaymentStatus(id);
}

/**
 * @type {import('express').Handler}
 */
async function getSubscriptionByUser(req, res) {
  const userId = req.params.userId;
  try {
    const subscription = await SubscriptionSchema.findOne({ userId });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    const providerInfo = await paymentService.getSubscription(
      subscription.subscriptionId
    );

    console.log('INFO', providerInfo);

    res.json({
      data: {
        ...subscription.toObject(),
        nextChargeDate: providerInfo.nextChargeDate,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Couldn't fetch subscription" });
  }
}

/**
 * @type {import('express').Handler}
 */
async function changePaymentMethod(req, res) {
  const userId = req.params.userId;

  const subscriptionSchema = Joi.object({
    method: Joi.string()
      .valid(...Object.values(PaymentMethods))
      .required(),
  });

  const { error } = subscriptionSchema.validate(req.body);

  if (error) {
    let response = {
      status_code: 400,
      message: error?.details[0]?.message,
      data: error,
    };
    return res.status(400).send(response);
  }

  try {
    const oldSubscription = await SubscriptionSchema.findOneAndUpdate(
      { userId },
      {
        paymentMethod: req.body.method,
      }
    );

    // TODO: If older Payment method is "debit" and new is wire... cancel current debit subscription.,
    if (
      oldSubscription.paymentMethod === PaymentMethods.DIRECT_DEBIT &&
      req.body === PaymentMethods.WIRE_TRANSFER
    ) {
      await paymentService.cancelSubscription(oldSubscription.subscriptionId);

      // .... TODO: Complete
    }
    // TODO: If older Payment method is "wire" and new is debit... create new debit subscription, schedule user wire job to be over at end of cycle
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Failed to cancel subscription' });
  }
  return res.json({ message: 'Subscription Cancelled' });
}

/**
 * @type {import('express').Handler}
 */
async function cancelSubscription(req, res) {
  const userId = req.params.userId;
  try {
    const subscription = await SubscriptionSchema.findOneAndUpdate(
      { userId },
      {
        statusTracking: SubscriptionStatusTracking.INACTIVE,
      }
    );
    await paymentService.cancelSubscription(subscription.subscriptionId);
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: 'Failed to cancel subscription' });
  }
  return res.json({ message: 'Subscription Cancelled' });
}

/**
 * @type {import('express').Handler}
 */
async function webhookHandler(req, res, next) {
  try {
    await paymentService.handleCallback(req, res);
  } catch (error) {
    console.error(error);

    if (error instanceof ProviderCallbackError) {
      return res
        .status(error.statusCode)
        .json({ message: `Webhook Error: ${error.message}` });
    }
    return res.status(500).json({ message: 'Webhook handler failed' });
  }
  return res.json({ message: 'Webhook event handled successfully' });
}

/**
 * @type {import('express').Handler}
 */
async function downloadReceiptPDF(req, res) {
  const invoiceId = req.params.id;

  // create an array to store the pdf data
  let pdfData = [];

  try {
    const invoice = await InvoiceSchema.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice doesn't exist",
      });
    }

    const pdfsFolderPath = path.join('public', 'pdfs');

    if (!fs.existsSync(pdfsFolderPath)) {
      fs.mkdirSync(pdfsFolderPath);
    }

    const pdfName = `psymax-order-${invoice.referenceId}.pdf`;
    // const pdfName = `psymax-order-${subscription?._id}`;
    const pdfFilePath = pdfsFolderPath + pdfName;

    const userId = req.user.user_id;
    const user = await UserSchema.findById(userId);

    let htmlTemplate = fs.readFileSync(
      path.join('html', 'pdfs', 'invoice.html'),
      'utf-8'
    );

    htmlTemplate = htmlTemplate
      .replace(/{{Vorname}}/g, user?.Vorname)
      .replace(/{{Nachname}}/g, user?.Nachname)
      .replace(/{{PLZ}}/g, user?.PLZ);

    htmlTemplate = htmlTemplate.replace(
      /{{InvoiceDate}}/g,
      dayjs(invoice?.createdAt).format('ddd MMMM YYYY, HH:mm:ss')
    );

    const { pricing_noVat, pricing, vatPercentage, name } = getPlanInfo(
      invoice.plan
    );

    htmlTemplate = htmlTemplate
      .replace(/{{InvoiceNumber}}/g, invoice.referenceId)
      .replace(/{{Datum}}/g, dayjs(invoice.createdAt).format('DD.MM.YYYY'))
      .replace(/{{Description}}/g, `${name} Payment`)
      .replace(/{{Betrag}}/g, pricing_noVat.toLocaleString())
      .replace(/{{VAT}}/g, vatPercentage * pricing_noVat)
      .replace(/{{Total}}/g, pricing.toLocaleString());

    // add user details as rotated text to the pdf
    htmlTemplate = htmlTemplate
      .replace(/{{Praxistitel}}/g, user?.Praxistitel || '')
      .replace(/{{Praxisbezeichnung}}/g, user?.Praxisbezeichnung || '')
      .replace(/{{Titel}}/g, user?.Titel)
      .replace(/{{Vorname}}/g, user?.Vorname)
      .replace(/{{Nachname}}/g, user?.Nachname)
      .replace(
        /{{Strasse_und_Hausnummer}}/g,
        user?.Strasse_und_Hausnummer || ''
      )
      .replace(/{{Ort}}/g, user?.Ort || '')
      .replace(/{{Postleitzahl}}/g, user?.PLZ || '')
      .replace(/{{Telefon}}/g, user?.Telefon || '')
      .replace(/{{Email}}/g, user?.email)
      .replace(/{{Website}}/g, user?.Website || '');

    let file = await generatePDF(htmlTemplate, pdfName, pdfFilePath);

    if (file) {
      var bitmap = await fs.promises.readFile(pdfFilePath);
      // convert binary file to base64 encoded string
      let base64Pdf = Buffer.from(bitmap).toString('base64');

      if (fs.existsSync(pdfFilePath)) {
        fs.unlinkSync(pdfFilePath);
      }

      // push the pdf data to the array
      pdfData.push({ base64Pdf, fileName: pdfName });
    }
  } catch (error) {
    //
  }

  // check if the pdf data array is not empty
  if (pdfData.length > 0) {
    // send the pdf data array as the response
    let response = {
      status_code: 200,
      message: 'Export erfolgreich',
      data: pdfData,
    };
    return res.status(200).send(response);
  } else {
    // handle the case when no pdf files were generated
    return res.status(500).json({
      message: 'Conversion failed!',
    });
  }
}

/**
 * @type {import('express').Handler}
 */
async function downloadSummaryReceiptPDFs(req, res) {
  const { invoiceIds } = req.body;

  if (!invoiceIds) {
    return res.status(400).json({
      status: 'fail',
      message: 'Bad request',
    });
  }

  const pdfsFolderPath = path.join('public', 'pdfs');

  if (!fs.existsSync(pdfsFolderPath)) {
    fs.mkdirSync(pdfsFolderPath);
  }

  const pdfName = `psymax-order-summary-${Date.now()}.pdf`;
  // const pdfName = `psymax-order-${subscription?._id}`;
  const pdfFilePath = pdfsFolderPath + pdfName;

  // create an array to store the pdf data
  let pdfData = [];
  let invoiceSummary = [];

  try {
    const userId = req.user.user_id;
    const user = await UserSchema.findById(userId);

    let htmlTemplate = fs.readFileSync(
      path.join('html', 'pdfs', 'invoice-export.html'),
      'utf-8'
    );

    htmlTemplate = htmlTemplate
      .replace(/{{Vorname}}/g, user?.Vorname)
      .replace(/{{Nachname}}/g, user?.Nachname);

    // add user details as rotated text to the pdf
    htmlTemplate = htmlTemplate
      .replace(/{{Praxistitel}}/g, user?.Praxistitel || '')
      .replace(/{{Praxisbezeichnung}}/g, user?.Praxisbezeichnung || '')
      .replace(/{{Titel}}/g, user?.Titel)
      .replace(
        /{{Strasse_und_Hausnummer}}/g,
        user?.Strasse_und_Hausnummer || ''
      )
      .replace(/{{Ort}}/g, user?.Ort || '')
      .replace(/{{Postleitzahl}}/g, user?.PLZ || '')
      .replace(/{{Telefon}}/g, user?.Telefon || '')
      .replace(/{{Email}}/g, user?.email)
      .replace(/{{Website}}/g, user?.Website || '');

    // for each id in invoice ids...push
    let totalInvoiceAmount = 0;
    for (const id of invoiceIds) {
      let invoice = await InvoiceSchema.findById(id);
      let planAmount = getPlanInfo(invoice.plan).pricing;
      totalInvoiceAmount += planAmount;

      invoiceSummary.push(
        `<tr>
          <td>${invoice.referenceId}</td>
          <td>${dayjs(invoice.createdAt).format('ddd MMMM YYYY, HH:mm:ss')}</td>
          <td>${planAmount.toLocaleString()}</td>
        </tr>`
      );
    }

    htmlTemplate = htmlTemplate
      .replace(/{{InvoicesSummary}}/g, invoiceSummary.join(''))
      .replace(/{{Total}}/g, totalInvoiceAmount.toFixed(3));

    let file = await generatePDF(
      htmlTemplate,
      pdfName,
      pdfFilePath,
      '',
      '',
      '',
      ''
    );

    if (file) {
      var bitmap = await fs.promises.readFile(pdfFilePath);
      // convert binary file to base64 encoded string
      let base64Pdf = Buffer.from(bitmap).toString('base64');

      if (fs.existsSync(pdfFilePath)) {
        fs.unlinkSync(pdfFilePath);
      }

      // push the pdf data to the array
      pdfData.push({ base64Pdf, fileName: pdfName });
    }
  } catch (error) {
    //
  }

  // check if the pdf data array is not empty
  if (pdfData.length > 0) {
    // send the pdf data array as the response
    let response = {
      status_code: 200,
      message: 'Export erfolgreich',
      data: pdfData,
    };
    return res.status(200).send(response);
  } else {
    // handle the case when no pdf files were generated
    return res.status(500).json({
      message: 'Conversion failed!',
    });
  }
}

/**
 * @type {import('express').Handler}
 */
async function getInvoicesByUser(req, res) {
  const userId = req.params.userId;
  try {
    const invoices = await InvoiceSchema.find({ userId });
    res.json({ invoices });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Couldn't fetch invoices" });
  }
}

module.exports = {
  makePayment,
  makeSubscription,
  getPaymentStatus,
  webhookHandler,
  getSubscriptionByUser,
  getInvoicesByUser,
  downloadReceiptPDF,
  downloadSummaryReceiptPDFs,
  cancelSubscription,
  changePaymentMethod,
};
