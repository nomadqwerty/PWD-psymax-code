/* global document */
const puppeteer = require('puppeteer');
const fs = require('fs');
const nodemailer = require('nodemailer');
const {
  EmailHost,
  EmailPort,
  EmailUser,
  EmailPassword,
  EmailFrom,
  SubscriptionPlans,
} = require('./constants');
const {
  globalPricing,
  vatPercentage,
  globalExtendedPricing,
  globalPricing_noVat,
  globalExtendedPricing_noVat,
} = require('../config');

// Create a function to get today's date in the desired format
const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}.${month}.${year}`;
};

const randomCodeStr = (limit) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < limit; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

const generatePDF = async (
  html,
  pdf_name,
  pdfFilePath,
  marginCustom = {
    top: '70px',
    bottom: '70px',
    right: '70px',
    left: '70px',
  },
  footerHTML = '',
  headerHTML = '',
  rotatedText = ''
) => {
  try {
    // Create a browser instance
    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.env.CHROMIUM_PATH
        ? '/usr/bin/chromium-browser'
        : false,
      args: ['--no-sandbox', '--font-render-hinting=none'],
    });

    // Create a new page
    const page = await browser.newPage();

    // Load your HTML content
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // Load your external CSS
    await page.addStyleTag({ path: './html/pdfs/pdfStyles.css' });

    // Emulate print media styles
    await page.emulateMediaType('screen');

    // Evaluate fonts loading
    await page.evaluateHandle('document.fonts.ready');

    // Add rotated text
    await page.evaluate((rotatedText) => {
      const rotatedTextStyle = `
        .rotated-text {
          color: #2B86FC;
          font-family: 'Inter Tight';
          font-size: 9px;
          font-weight: 400;
          white-space: nowrap;
          position: absolute;
          bottom: 0;
          top: -40%;
          left: 40px;
          writing-mode: vertical-lr;
          text-orientation: sideways;
          transform: translate(0%, 100%) rotate(180deg);
          margin-right: 10px;
        }`;

      const styleTag = document.createElement('style');
      styleTag.textContent = rotatedTextStyle;
      document.head.appendChild(styleTag);

      const div = document.createElement('div');
      div.className = 'rotated-text';
      div.textContent = rotatedText;
      document.body.appendChild(div);
    }, rotatedText);

    // Set up the PDF generation options
    const pdfBytes = await page.pdf({
      path: pdfFilePath,
      printBackground: true,
      format: 'A4',
      displayHeaderFooter: true,
      footerTemplate: footerHTML || '<div></div>',
      headerTemplate: headerHTML || '<div></div>',
      margin: marginCustom,
    });

    // Write the PDF to file
    await fs.promises.writeFile(pdfFilePath, pdfBytes);

    await browser.close();

    return pdf_name;
  } catch (error) {
    console.log(error, 'Error generating PDF');
    return false;
  }
};

const sendSMTPMail = async (
  to,
  subject,
  message,
  attachments = [],
  bcc = [],
  replyTo = []
) => {
  let transporter = nodemailer.createTransport({
    host: EmailHost,
    port: EmailPort,
    auth: {
      user: EmailUser,
      pass: EmailPassword,
    },
  });

  let info = await transporter.sendMail({
    from: EmailFrom,
    to: to,
    subject: subject,
    html: message,
    attachments: attachments.map(({ filename, path }) => ({
      filename: filename,
      path: path,
    })),
    bcc: bcc,
    replyTo: replyTo,
  });
  transporter.close();
  return info?.messageId;
};

/**
 *
 * @param {keyof SubscriptionPlans} plan
 */
function getPlanInfo(plan) {
  return {
    [SubscriptionPlans.GLOBAL]: {
      pricing: globalPricing,
      pricing_noVat: globalPricing_noVat,
      vatPercentage,
      name: 'Global',
    },
    [SubscriptionPlans.GLOBAL_EXTENDED]: {
      pricing: globalExtendedPricing,
      pricing_noVat: globalExtendedPricing_noVat,
      vatPercentage,
      name: 'Global Extended',
    },
  }[plan];
}

/** Exempts route path from middleware if it matches predicate
 * @param {import('express').Handler} middleware - Middleware Function
 * @param {string[]} paths - Paths to exempt
 */
const unless = (middleware, ...paths) => {
  /** @type {import('express').Handler} middleware */
  return function (req, res, next) {
    const pathCheck = paths.some((path) => path === req.path);
    pathCheck ? next() : middleware(req, res, next);
  };
};
module.exports = {
  getFormattedDate,
  randomCodeStr,
  generatePDF,
  sendSMTPMail,
  getPlanInfo,
  unless,
};
