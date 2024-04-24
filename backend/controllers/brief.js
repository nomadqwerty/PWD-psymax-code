const Joi = require('joi');
const { generatePDF, sendSMTPMail } = require('../utils/common');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { BriefSchema } = require('../models/briefModel');
const { KlientSchema } = require('../models/klientModel');
const { UserSchema } = require('../models/userModel');
const { ArztSchema } = require('../models/arztModel');

const save = async (req, res, next) => {
  try {
    const requestBody = req.body;

    const briefSchema = Joi.object({
      id: Joi.string().required(),
      Templete: Joi.string().required(),
      Betreff: Joi.string().required(),
      Inhalt: Joi.string().required(),
      Unterschriftsfeld1: Joi.string().required(),
      Unterschriftsfeld2: Joi.string().required(),
      OptionSelected: Joi.number().required(),
    });

    const { error } = briefSchema.validate(req.body);

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
        _id: requestBody?.id,
        userId: user?._id,
        isDeleted: 0,
      }).exec();

      let id = '';
      let chiffre = null;
      let klientDocter = null;
      if (CheckKlientExist) {
        id = CheckKlientExist?._id;
        chiffre = CheckKlientExist?.Chiffre;
        klientDocter = CheckKlientExist;
      } else {
        const CheckArztExist = await ArztSchema.findOne({
          _id: requestBody?.id,
          isDeleted: 0,
        }).exec();
        if (CheckArztExist) {
          id = CheckArztExist?._id;
          klientDocter = CheckArztExist;
        }
      }
      if (id) {
        const newBrief = new BriefSchema({
          KlientId: chiffre ? id : null,
          KlientChiffre: chiffre,
          ArztId: chiffre ? null : id,
          Templete: requestBody?.Templete,
          Betreff: requestBody?.Betreff,
          Unterschriftsfeld1: requestBody?.Unterschriftsfeld1,
          Unterschriftsfeld2: requestBody?.Unterschriftsfeld2,
          OptionSelected: requestBody?.OptionSelected,
          Inhalt: requestBody?.Inhalt,
        });
        await newBrief.save();

        if (newBrief) {
          // Send Email
          if (
            newBrief?.OptionSelected === 2 ||
            newBrief?.OptionSelected === 3
          ) {
            let message = fs.readFileSync('./html/emails/brief.html', 'utf8');
            message = message
              .replace(/{{Klient_Titel}}/g, klientDocter?.Titel)
              .replace(/{{Klient_Vorname}}/g, klientDocter?.Vorname)
              .replace(/{{Klient_Nachname}}/g, klientDocter?.Nachname)
              .replace(/{{Titel}}/g, user?.Titel)
              .replace(/{{Vorname}}/g, user?.Vorname)
              .replace(/{{Nachname}}/g, user?.Nachname)
              .replace(
                /{{Strasse_und_Hausnummer}}/g,
                user?.Strasse_und_Hausnummer
              )
              .replace(/{{Ort}}/g, user?.Ort)
              .replace(/{{PLZ}}/g, user?.PLZ)
              .replace(/{{Telefon}}/g, user?.Telefon)
              .replace(/{{Email}}/g, user?.email)
              .replace(/{{Website}}/g, user?.Website)
              .replace(/{{Praxistitel}}/g, user?.Praxistitel)
              .replace(/{{Praxisbezeichnung}}/g, user?.Praxisbezeichnung);

            const subject = requestBody?.Betreff;
            await sendSMTPMail(
              klientDocter?.email,
              subject,
              message
              // [{ filename: summarypdfName, path: summarypdfFilePath }]
            );
            if (newBrief?.OptionSelected === 2) {
              let response = {
                status_code: 200,
                message: 'Begründung hinzugefügt',
              };
              return res.status(200).send(response);
            }
          }

          // Download PDF
          if (
            newBrief?.OptionSelected === 1 ||
            newBrief?.OptionSelected === 3
          ) {
            const pdfsFolderPath = __dirname + '/../public/pdfs/';
            if (!fs.existsSync(pdfsFolderPath)) {
              fs.mkdirSync(pdfsFolderPath);
            }
            const pdf_name = `brief_${Date.now()}.pdf`;
            const pdfFilePath = pdfsFolderPath + pdf_name;
            let Inhalt = newBrief?.Inhalt.replace(/>\s+</g, '><')
              .replace(/font-size:\s*16px;/g, 'font-size: 10px;')
              .replace(/line-height:\s*24px;/g, 'line-height: 12px;')
              .replace(/<\/p><br \/><p>/g, '</p><p>');

            let html = fs.readFileSync('./html/pdfs/brief.html', 'utf8');

            html = html
              .replace(/{{Klient_Titel}}/g, klientDocter?.Titel)
              .replace(/{{Klient_Vorname}}/g, klientDocter?.Vorname)
              .replace(/{{Klient_Nachname}}/g, klientDocter?.Nachname)
              .replace(/{{Klient_Firma}}/g, klientDocter?.Firma)
              .replace(
                /{{Klient_Strasse_und_Hausnummer}}/g,
                klientDocter?.Strasse_und_Hausnummer
              )
              .replace(/{{Klient_PLZ}}/g, klientDocter?.PLZ)
              .replace(/{{Klient_Ort}}/g, klientDocter?.Ort)
              .replace(/{{Praxisbeschreibung}}/g, user?.Praxisbeschreibung)
              .replace(/{{Praxistitel}}/g, user?.Praxistitel)
              .replace(
                /{{Strasse_und_Hausnummer}}/g,
                user?.Strasse_und_Hausnummer
              )
              .replace(/{{Ort}}/g, user?.Ort)
              .replace(/{{PLZ}}/g, user?.PLZ)
              .replace(/{{Telefon}}/g, user?.Telefon)
              .replace(/{{Email}}/g, user?.email)
              .replace(/{{Website}}/g, user?.Website)
              .replace(/{{Steuernummer}}/g, user?.Steuernummer)
              .replace(/{{Betreff}}/g, newBrief?.Betreff)
              .replace(/{{Inhalt}}/g, Inhalt)
              .replace(/{{Unterschriftsfeld1}}/g, newBrief?.Unterschriftsfeld1)
              .replace(/{{Unterschriftsfeld2}}/g, newBrief?.Unterschriftsfeld2)
              .replace(
                /{{Praxistitel_bullets}}/g,
                user?.Praxistitel ? '&bull;' : ''
              )
              .replace(
                /{{Strasse_und_Hausnummer_bullets}}/g,
                user?.Strasse_und_Hausnummer ? '&bull;' : ''
              )
              .replace(
                /{{Praxistitel_Right}}/g,
                user?.Praxistitel
                  ? `<div style="color: #2B86FC;font-weight: 500;padding-bottom: 4px;"> ${user?.Praxistitel}</div>`
                  : ''
              )
              .replace(
                /{{Praxisbeschreibung_Right}}/g,
                user?.Praxisbeschreibung
                  ? `<div style="padding-bottom: 4px;">${user?.Praxisbeschreibung}</div>`
                  : ''
              );

            let rotatedText = `${user?.Praxistitel} ${
              user?.Praxisbeschreibung
            } ${user?.Praxistitel || user?.Praxisbeschreibung ? '∙' : ''} ${
              user?.Titel
            } ${user?.Vorname} ${user?.Nachname} ∙ ${
              user?.Strasse_und_Hausnummer
            } ${user?.Strasse_und_Hausnummer ? '∙' : ''} ${user?.Ort} ${
              user?.PLZ
            } ∙ Telefon ${user?.Telefon} ${user?.email} ${user?.Website}`;
            let data = await downloadPDF(
              html,
              pdf_name,
              pdfFilePath,
              rotatedText
            );
            if (data) {
              var bitmap = await fs.promises.readFile(pdfFilePath);
              // convert binary data to base64 encoded string
              let base64Pdf = Buffer.from(bitmap).toString('base64');

              let raw = Buffer.from(bitmap)

              if (fs.existsSync(pdfFilePath)) {
                fs.unlinkSync(pdfFilePath);
              }

              let response = {
                status_code: 200,
                message: 'Begründung hinzugefügt',
                data: { base64Pdf, fileName: pdf_name, raw },
              };
              console.log(newBrief._id);
              await BriefSchema.findByIdAndDelete({_id:newBrief._id})
              return res.status(200).send(response);
            }
          }
        }
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

const downloadPDF = async (html, pdf_name, pdfFilePath, rotatedText) => {
  const systamicaLogo =
    '<svg width="99" height="22" viewBox="0 0 99 22" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_227_915)"><path d="M24.3357 10.868C24.2921 10.384 24.0304 9.768 23.5507 9.416C23.1581 9.152 22.5476 8.888 21.5445 9.24C21.0211 9.46 20.585 9.636 20.1925 9.812C19.6255 10.032 19.1894 10.252 18.8841 10.296C17.9247 10.428 17.0524 10.032 16.5291 9.24L21.937 6.072L21.2828 4.884L15.8749 8.052C15.4824 7.216 15.5696 6.248 16.1366 5.5C16.311 5.236 16.7035 4.972 17.1833 4.576C17.5322 4.312 17.8811 4.048 18.3608 3.652C19.1458 2.992 19.2767 2.288 19.233 1.848C19.1458 1.232 18.7533 0.704 18.3608 0.44C18.3172 0.44 18.2736 0.396 18.23 0.396C18.1863 0.352 18.1427 0.352 18.1427 0.352C17.7066 0.132 17.0524 0.044 16.4855 0.308C16.0493 0.484 15.526 0.924 15.3515 1.98C15.2643 2.552 15.2207 3.036 15.1335 3.432C15.0463 4.048 15.0026 4.532 14.8718 4.796C14.5229 5.676 13.7379 6.248 12.7784 6.292V0H11.4264V6.292C10.5106 6.204 9.72555 5.676 9.37665 4.796C9.24582 4.488 9.2022 4.004 9.11498 3.432C9.07137 2.992 8.98414 2.552 8.89692 1.98C8.72247 0.968 8.19912 0.528 7.763 0.308C7.19603 0.044 6.58546 0.132 6.10573 0.352C6.06211 0.352 6.0185 0.396 6.0185 0.396C5.97489 0.396 5.93128 0.44 5.93128 0.44C5.53877 0.704 5.14626 1.232 5.05903 1.848C5.01542 2.332 5.10264 2.992 5.93128 3.652C6.3674 4.004 6.75991 4.312 7.10881 4.576C7.58855 4.928 7.98106 5.236 8.15551 5.5C8.72247 6.292 8.8533 7.216 8.41718 8.096L3.05286 4.928L2.39868 6.116L7.763 9.24C7.23965 10.032 6.3674 10.384 5.45154 10.296C5.14626 10.252 4.71013 10.076 4.14317 9.812C3.75066 9.636 3.31454 9.46 2.79119 9.24C1.83172 8.888 1.17753 9.108 0.785022 9.416C0.305286 9.768 0.0436123 10.384 0 10.868C0 10.912 0 10.956 0 11C0 11.044 0 11.088 0 11.132C0.0436123 11.616 0.305286 12.232 0.785022 12.584C1.17753 12.848 1.78811 13.112 2.79119 12.76C3.31454 12.54 3.75066 12.364 4.14317 12.188C4.71013 11.968 5.14626 11.748 5.45154 11.704C6.41101 11.572 7.28326 11.968 7.80661 12.76L2.39868 15.928L3.05286 17.116L8.46079 13.948C8.8533 14.784 8.76608 15.752 8.19912 16.5C8.02467 16.764 7.63216 17.028 7.15242 17.424C6.80352 17.688 6.45463 17.952 5.97489 18.348C5.18987 19.008 5.05903 19.712 5.10264 20.152C5.18987 20.768 5.58238 21.296 5.97489 21.56C6.0185 21.604 6.06211 21.604 6.06211 21.604C6.10573 21.604 6.14934 21.648 6.14934 21.648C6.41101 21.78 6.7163 21.824 7.02159 21.824C7.28326 21.824 7.54493 21.78 7.763 21.692C8.19912 21.516 8.72247 21.076 8.89692 20.02C8.98414 19.448 9.02775 18.964 9.11498 18.568C9.2022 17.952 9.24582 17.468 9.37665 17.204C9.72555 16.324 10.5106 15.752 11.47 15.708V22H12.822V15.708C13.7379 15.796 14.5229 16.324 14.8718 17.204C15.0026 17.512 15.0463 17.996 15.1335 18.568C15.1771 19.008 15.2643 19.448 15.3515 20.02C15.526 21.032 16.0493 21.472 16.4855 21.692C16.7471 21.78 16.9652 21.824 17.2269 21.824C17.5758 21.824 17.8811 21.736 18.0991 21.648C18.1427 21.648 18.1863 21.604 18.1863 21.604C18.23 21.604 18.2736 21.56 18.2736 21.56C18.6661 21.296 19.0586 20.768 19.1458 20.152C19.1894 19.668 19.1022 19.008 18.2736 18.348C17.8374 17.996 17.4449 17.688 17.096 17.424C16.6163 17.072 16.2238 16.764 16.0493 16.5C15.4824 15.708 15.3515 14.784 15.7877 13.904L21.1956 17.072L21.8498 15.884L16.5291 12.76C17.0524 11.968 17.9247 11.616 18.8405 11.704C19.1458 11.748 19.5819 11.924 20.1489 12.188C20.5414 12.364 20.9775 12.54 21.5009 12.76C22.4604 13.112 23.1145 12.892 23.507 12.584C23.9868 12.232 24.2485 11.616 24.2921 11.132C24.2921 11.088 24.2921 11.044 24.2921 11C24.3357 10.956 24.3357 10.912 24.3357 10.868ZM17.0524 1.54C17.2269 1.452 17.4885 1.54 17.5758 1.584C17.663 1.672 17.8374 1.848 17.8811 2.024C17.8811 2.244 17.663 2.464 17.4885 2.64C17.1396 2.948 16.7907 3.212 16.4855 3.432C16.5727 3.036 16.6163 2.64 16.7035 2.156C16.7035 1.936 16.8344 1.628 17.0524 1.54ZM14.3048 7.304C14.3485 7.788 14.4793 8.272 14.6974 8.756L12.822 9.856V7.7C13.3454 7.612 13.8251 7.524 14.3048 7.304ZM6.84714 2.64C6.67269 2.508 6.45463 2.244 6.45463 2.024C6.49824 1.804 6.67269 1.628 6.75991 1.584C6.89075 1.54 7.10881 1.452 7.28326 1.54C7.50132 1.628 7.58855 1.936 7.63216 2.156C7.71938 2.64 7.763 3.036 7.80661 3.432C7.54493 3.212 7.19603 2.948 6.84714 2.64ZM10.0308 7.304C10.467 7.524 10.9467 7.656 11.47 7.656V9.856L9.59471 8.756C9.85639 8.272 9.98722 7.788 10.0308 7.304ZM2.31145 11.484C2.09339 11.572 1.78811 11.66 1.57004 11.484C1.39559 11.352 1.35198 11.132 1.30837 11C1.30837 10.868 1.39559 10.648 1.57004 10.516C1.74449 10.384 2.04978 10.428 2.31145 10.516C2.74758 10.692 3.14009 10.824 3.48899 11C3.14009 11.176 2.74758 11.308 2.31145 11.484ZM7.89383 11C8.28634 10.736 8.63524 10.34 8.94053 9.9L10.8159 11L8.94053 12.1C8.67885 11.66 8.32996 11.308 7.89383 11ZM7.28326 20.504C7.10881 20.592 6.84714 20.504 6.75991 20.46C6.67269 20.372 6.49824 20.196 6.45463 20.02C6.41101 19.8 6.62907 19.536 6.84714 19.404C7.19603 19.096 7.54493 18.832 7.85022 18.612C7.80661 18.964 7.763 19.404 7.67577 19.888C7.58855 20.108 7.50132 20.416 7.28326 20.504ZM10.0308 14.74C9.98722 14.256 9.85639 13.772 9.63833 13.288L11.5137 12.188V14.344C10.9903 14.388 10.467 14.52 10.0308 14.74ZM17.4885 19.404C17.663 19.536 17.8811 19.8 17.8811 20.02C17.8374 20.24 17.663 20.416 17.5758 20.46C17.4449 20.504 17.2269 20.592 17.0524 20.504C16.8344 20.416 16.7471 20.108 16.7035 19.888C16.6163 19.404 16.5727 19.008 16.5291 18.612C16.7907 18.832 17.1396 19.096 17.4885 19.404ZM14.3048 14.74C13.8687 14.52 13.389 14.388 12.8656 14.388V12.188L14.741 13.288C14.4793 13.728 14.3485 14.212 14.3048 14.74ZM13.5198 11L15.3952 9.9C15.6568 10.34 16.0493 10.736 16.4419 11C16.0493 11.264 15.7004 11.66 15.3952 12.1L13.5198 11ZM22.722 11.484C22.5476 11.616 22.2423 11.572 21.9806 11.484C21.5445 11.308 21.152 11.176 20.8031 11C21.152 10.868 21.5445 10.692 21.9806 10.516C22.1987 10.428 22.504 10.34 22.722 10.516C22.8965 10.648 22.9401 10.868 22.9837 11C22.9837 11.132 22.8965 11.396 22.722 11.484Z" fill="#2B86FC" /><path d="M50.7207 6.07173C50.1974 6.33573 49.4996 6.99573 49.2379 8.31573C49.1071 9.10773 49.0199 9.98773 48.9326 10.6477C48.8454 11.5717 48.7146 12.3637 48.5401 12.8037C47.8423 14.5197 46.3595 14.8717 45.2256 14.8717V16.2357C46.2287 16.2357 47.1009 16.0157 47.8859 15.5317C48.7146 15.0477 49.3688 14.2557 49.7613 13.2877C50.0229 12.6717 50.1102 11.8357 50.241 10.7797C50.3282 10.1637 50.4155 9.28373 50.5463 8.53573C50.7644 7.21573 51.5494 7.08373 52.0727 7.08373C52.1163 7.08373 52.1163 7.08373 52.1163 7.08373V5.71973C52.1163 5.71973 52.1163 5.71973 52.0727 5.71973C51.9855 5.76373 51.3749 5.76373 50.7207 6.07173Z" fill="#2B86FC" /><path d="M34.2354 6.07173C33.712 6.33573 33.0142 6.99573 32.7526 8.31573C32.6217 9.10773 32.5345 9.98773 32.4473 10.6477C32.3601 11.5717 32.2292 12.3637 32.0548 12.8037C31.357 14.5197 29.8742 14.8717 28.7402 14.8717V16.2357C29.7433 16.2357 30.6156 16.0157 31.4006 15.5317C32.2292 15.0477 32.8834 14.2557 33.2759 13.2877C33.5376 12.6717 33.6248 11.8357 33.7557 10.7797C33.8429 10.1637 33.9301 9.28373 34.0609 8.53573C34.279 7.21573 35.064 7.08373 35.5874 7.08373C35.631 7.08373 35.631 7.08373 35.631 7.08373V5.71973C35.631 5.71973 35.631 5.71973 35.5874 5.71973C35.4565 5.76373 34.846 5.76373 34.2354 6.07173Z" fill="#2B86FC" /><path d="M43.3943 14.9156C42.304 14.9156 40.8212 14.5636 40.1234 12.8476C39.9489 12.4076 39.8617 11.6156 39.7309 10.6916C39.6437 10.0316 39.5564 9.15162 39.4256 8.35962C39.2075 6.99562 38.5097 6.37962 37.9428 6.11562C37.3322 5.80762 36.7216 5.80762 36.5036 5.80762C36.5036 5.80762 36.5036 5.80762 36.46 5.80762V7.17162H36.5036C37.0705 7.17162 37.8119 7.30362 38.03 8.62362C38.1608 9.37162 38.2481 10.2516 38.3353 10.8676C38.4661 11.9236 38.5534 12.8036 38.815 13.3756C39.2075 14.3436 39.8617 15.0916 40.6904 15.6196C41.4318 16.0596 42.3476 16.3236 43.3507 16.3236V21.1636H44.7027V5.85162H43.3507V14.9156H43.3943Z" fill="#2B86FC" /><path d="M82.6889 5.85156H81.3369V16.1916H82.6889V5.85156Z" fill="#2B86FC" /><path d="M55.9543 0.923828H54.6023V5.76383H53.0322V7.12783H54.6023V16.1918H55.9543V7.12783H57.5679V5.76383H55.9543V0.923828Z" fill="#2B86FC" /><path d="M85.2185 12.8037C85.044 12.4077 84.8696 11.6157 84.8696 10.9997C84.8696 10.3837 85.044 9.59167 85.2185 9.19567C85.829 7.74367 87.0938 7.12767 89.318 7.12767H90.0158V5.76367H89.318C87.966 5.76367 86.8757 5.98367 86.0035 6.42367C85.0876 6.90767 84.3898 7.65567 83.9537 8.66767C83.7356 9.19567 83.5176 10.1637 83.5176 10.9997C83.5176 11.8357 83.7356 12.8037 83.9537 13.3317C84.3898 14.3437 85.044 15.0917 86.0035 15.5757C86.8757 16.0157 87.966 16.2357 89.318 16.2357H90.3211V14.8717H89.318C87.0938 14.9157 85.829 14.2557 85.2185 12.8037Z" fill="#2B86FC" /><path d="M98.9995 16.1917L98.7815 10.9557C98.7815 10.1197 98.5634 9.19567 98.3454 8.66767C97.9092 7.65567 97.2551 6.90767 96.2956 6.42367C95.4233 5.98367 94.333 5.76367 92.981 5.76367H91.7163V7.12767H92.981C95.2489 7.12767 96.5136 7.78767 97.0806 9.19567C97.1678 9.37167 97.2114 9.63567 97.2551 9.85567H93.7661C92.0652 9.85567 90.626 11.2637 90.626 13.0237C90.626 14.7837 92.0216 16.2357 93.7661 16.2357C94.7691 16.2357 95.6414 16.0157 96.4264 15.5317C96.8625 15.2677 97.255 14.9157 97.5603 14.5197L97.604 16.1917H98.9995ZM97.1242 12.7157C96.4264 14.4317 94.9436 14.8717 93.8097 14.8717C92.8066 14.8717 92.0216 13.9917 92.0216 13.0237C92.0216 12.0117 92.8066 11.2197 93.8097 11.2197H97.4295C97.3859 11.7477 97.255 12.3637 97.1242 12.7157Z" fill="#2B86FC" /><path d="M77.8044 12.8476C77.6736 12.3636 77.5427 11.6156 77.4555 10.7356C77.3683 10.1196 77.2811 9.37162 77.1502 8.57962C77.0194 7.69962 76.6269 6.95162 76.0599 6.46762C75.5802 6.02762 74.926 5.80762 74.3154 5.80762C73.7048 5.80762 73.007 5.85162 72.3965 6.29162C72.1784 6.42362 72.004 6.59962 71.8731 6.77562C71.2189 6.02762 70.2595 5.80762 69.6053 5.80762C69.3436 5.80762 68.6458 5.85162 67.9916 6.24762C67.3811 6.64362 66.6396 7.39162 66.6396 8.97562V16.1916H67.9916V8.93162C67.9916 8.18362 68.2097 7.65562 68.6894 7.34762C69.0819 7.08362 69.5181 7.08362 69.6053 7.08362C69.6925 7.08362 70.1286 7.08362 70.5648 7.34762C71.0445 7.65562 71.2626 8.13962 71.2626 8.88762V16.1036H72.6145V8.93162C72.6145 8.93162 72.6145 8.93162 72.6145 8.88762C72.6145 7.21562 73.3559 7.08362 74.3154 7.08362C74.6207 7.08362 75.5802 7.21562 75.7982 8.75562C75.9291 9.54762 76.0163 10.2956 76.1035 10.8676C76.2344 11.8356 76.3216 12.6716 76.496 13.2436C76.8449 14.3436 77.3683 15.0916 78.0661 15.5756C78.7203 16.0156 79.4617 16.1916 80.552 16.1916V14.8276C79.2 14.9156 78.3278 14.5636 77.8044 12.8476Z" fill="#2B86FC" /><path d="M65.6803 8.97567C65.6803 7.25967 64.2847 5.76367 62.5402 5.76367C60.4032 5.76367 58.7895 6.86367 58.0045 8.75567C57.7864 9.28367 57.5684 10.2077 57.5684 10.9997C57.5684 11.7917 57.7864 12.8037 58.0045 13.3317C58.4406 14.3437 59.0948 15.0917 60.0543 15.5757C60.9265 16.0157 62.0168 16.2357 63.3688 16.2357H65.2877V14.8717H63.3688C61.101 14.8717 59.8362 14.2117 59.2692 12.8037C59.182 12.6277 59.1384 12.3637 59.0948 12.1437H62.5838C64.2847 12.1437 65.6803 10.7357 65.6803 8.97567ZM58.964 10.7797C59.0076 10.2077 59.1384 9.63567 59.3129 9.28367C59.8798 7.91967 61.0137 7.12767 62.6274 7.12767C63.6305 7.12767 64.4155 8.00767 64.4155 8.97567C64.4155 9.98767 63.6305 10.7797 62.6274 10.7797H58.964Z" fill="#2B86FC" /></g><defs><clipPath id="clip0_227_915"><rect width="99" height="22" fill="white" /></clipPath></defs></svg>';

  const headerHTML = `<div style="padding-left: 20mm; padding-top: 22mm; position: relative;">${systamicaLogo}<div style="position: absolute; top: 0; left: 1mm;"><div style="border-bottom: 1px solid #707070; width: 5mm; height: 105mm;"></div><div style="border-bottom: 1px solid #707070; width: 5mm; height: 56mm;"></div><div style="border-bottom: 1px solid #707070; width: 5mm; height: 76mm;"></div></div>`;

  const file = await generatePDF(
    html,
    pdf_name,
    pdfFilePath,
    {
      top: '45mm',
      bottom: '20mm',
      right: '15mm',
      left: '0px',
    },
    '',
    headerHTML,
    rotatedText
  );

  return file;
};

module.exports = { save };
