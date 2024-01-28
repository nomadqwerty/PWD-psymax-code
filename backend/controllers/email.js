const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { KlientSchema } = require('../models/klientModel');
const { EmailSchema } = require('../models/emailModel');
const { sendSMTPMail } = require('../utils/common');
const { UserSchema } = require('../models/userModel');

const send = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const renamedFiles = req.fileNames || [];

    const emailSchema = Joi.object({
      Betreff: Joi.string().required(),
      Briefvorlage: Joi.string().allow(''),
      Inhalt: Joi.string().required(),
      KlientId: Joi.string().required(),
    });

    const fileSchema = Joi.array().items(Joi.string());

    const attachmentsSchema = Joi.object({
      attachments: fileSchema,
    });

    const requestBodySchema = emailSchema.concat(attachmentsSchema);

    const { error } = requestBodySchema.validate({
      ...requestBody,
      attachments: renamedFiles,
    });

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
        data: error,
      };
      return res.status(400).send(response);
    }

    const decodedToken = jwt.verify(
      req.headers['x-access-token'],
      process.env.TOKEN_KEY
    );

    const user = await UserSchema.findById(decodedToken?.user_id).select(
      ' -__v'
    );
    if (user) {
      const CheckKlientExist = await KlientSchema.findOne({
        _id: requestBody?.KlientId,
      }).exec();

      let emailData = new EmailSchema({
        KlientId: requestBody?.KlientId,
        KlientChiffre: CheckKlientExist?.Chiffre,
        Templete: requestBody?.Briefvorlage,
        Betreff: requestBody?.Betreff,
        Inhalt: requestBody?.Inhalt,
        Attachments: renamedFiles,
      });
      if (emailData.save()) {
        let message = fs.readFileSync('./html/emails/email.html', 'utf8');
        let Inhalt = requestBody?.Inhalt.replace(/>\s+</g, '><').replace(
          /<\/p><br \/><p>/g,
          '</p><p>'
        );
        message = message
          .replace(/{{content}}/g, Inhalt)
          .replace(/{{Titel}}/g, user?.Titel)
          .replace(/{{Vorname}}/g, user?.Vorname)
          .replace(/{{Nachname}}/g, user?.Nachname)
          .replace(/{{Strasse_und_Hausnummer}}/g, user?.Strasse_und_Hausnummer)
          .replace(/{{Ort}}/g, user?.Ort)
          .replace(/{{PLZ}}/g, user?.PLZ)
          .replace(/{{Telefon}}/g, user?.Telefon)
          .replace(/{{Email}}/g, user?.email)
          .replace(/{{Website}}/g, user?.Website)
          .replace(/{{Praxistitel}}/g, user?.Praxistitel)
          .replace(/{{Praxisbezeichnung}}/g, user?.Praxisbezeichnung);

        const attachments = (renamedFiles || []).map((item) => ({
          filename: item,
          path: `${__dirname}/../public/uploads/email/${item}`,
        }));

        const subject = requestBody?.Betreff;
        await sendSMTPMail(
          CheckKlientExist?.email,
          subject,
          message,
          attachments
        );

        let response = {
          status_code: 200,
          message: '',
          data: emailData,
        };
        return res.status(200).send(response);
      }
    }
    let response = {
      status_code: 400,
      message: 'Etwas ist schief gelaufen.',
    };
    return res.status(400).send(response);
  } catch (error) {
    next(error);
  }
};

module.exports = { send };
