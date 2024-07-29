const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserSchema } = require('../models/userModel');
const Joi = require('joi');
const speakeasy = require('speakeasy');
const UserVault = require('../models/UserVault');
const ClientVault = require('../models/ClientVault');
const {
  TimeForTokenExpire,
  GLOBAL_POINT_VALUE,
  SubscriptionStatusTracking,
} = require('../utils/constants');
const { randomCodeStr } = require('../utils/common');
const fs = require('fs');
const zxcvbn = require('zxcvbn');
const { GlobalPointsSchema } = require('../models/globalPointsModel');
const dayjs = require('dayjs');
const { SubscriptionSchema } = require('../models/subscriptionModel');
const Email = require('./contactUtil/contactUtil');
const ServerVault = require('../models/ServerVault');
const { sendSMTPMail } = require('../utils/common');

const register = async (req, res, next) => {
  try {
    const { email, password, inviteCode, emergencyPassword, recoveryPhrase } =
      req.body;
    const passwordStrength = zxcvbn(password);

    if (passwordStrength?.score < 3 || recoveryPhrase.length < 4) {
      let response = {
        status_code: 400,
        message: 'Das Passwort sollte sicher sein',
      };
      return res.status(400).send(response);
    }

    const registrationSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required().valid(Joi.ref('password')),
      inviteCode: Joi.string().optional(),
      emergencyPassword: Joi.string(),
      recoveryPhrase: Joi.string().required(),
    });
    const { error } = registrationSchema.validate(req.body);
    console.log(error);
    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const checkExist = await UserSchema.findOne({
      email: email,
      status: { $in: [0, 1, 2] },
    });

    console.log(checkExist);

    if (checkExist) {
      let response = {
        status_code: 400,
        message: 'E-Mail existiert bereits',
      };
      return res.status(400).send(response);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const encryptedEmergencyPassword = await bcrypt.hash(emergencyPassword, 10);
    const encryptedRecoveryPhrase = await bcrypt.hash(recoveryPhrase, 10);

    const getInvitedUser = await UserSchema.findOne({ inviteCode: inviteCode });

    const randomCode = randomCodeStr(4);

    // 7 days trial if no referral, 84 days(3 CYCLES) if referred by admin, else 28 days(1 cycle)
    const numberOfTrialDays = getInvitedUser
      ? getInvitedUser.isAdmin
        ? 84
        : 28
      : 7;

    // NOTE: This considers DST, which might not be expected behavior
    const trialEnd = dayjs().add(numberOfTrialDays, 'day').toDate();

    const user = new UserSchema({
      email: email.toLowerCase(),
      password: encryptedPassword,
      confirmPassword: password,
      inviteCode: randomCode,
      invitedUserId: getInvitedUser?._id ? getInvitedUser?._id : null,
      isAdmin: 0,
      trialEnd,
      trialPeriodActive: true,
      trialDays: numberOfTrialDays,
      emergencyPassword: encryptedEmergencyPassword,
      recoveryPhrase: encryptedRecoveryPhrase,
      TwoFA: { secret: speakeasy.generateSecret(), permission: false },
    });
    await user.save();

    if (user) {
      const globalPointsSchema = new GlobalPointsSchema({
        userId: user?._id,
        value: GLOBAL_POINT_VALUE,
      });
      await globalPointsSchema.save();
    }
    console.log(user);
    let response = {
      status_code: 200,
      message: 'Registrierung erfolgreich.',
      data: { userId: user?._id },
    };
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // Get user input

    const { email, password } = req.body;

    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error } = loginSchema.validate(req.body);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    // Validate if user exist in our database
    // TODO: Exclude twoFA fields
    const user = await UserSchema.findOne({
      email: email,
    }).select(' -__v');

    if (!user) {
      let response = {
        status_code: 400,
        message: 'Benutzer nicht vorhanden.',
      };
      return res.status(400).send(response);
    } else {
      if (user?.status === 2) {
        let response = {
          status_code: 400,
          message: 'Dieses Konto ist deaktiviert.',
        };
        return res.status(400).send(response);
      } else if (user?.status === 3) {
        let response = {
          status_code: 400,
          message: 'Das Konto wurde gelöscht. Bitte erstellen Sie ein neues',
        };
        return res.status(400).send(response);
      }
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      // TODO: ON LOGIN IF THE TRIAL PHASE IS OVER, SET TRIAL TO EXPIRED
      const subscription = await SubscriptionSchema.findOne({
        userId: user._id,
        statusTracking: { $nin: [SubscriptionStatusTracking.INACTIVE] },
      });
      let subscription_status;
      // FIXME: Rethink on this
      if (dayjs().isAfter(user.trialEnd) && !subscription) {
        subscription_status = 'pending_subscription';
      }

      // Create token
      const payload = {
        user_id: user._id,
        email,
        exp: Math.floor(Date.now() / 1000) + TimeForTokenExpire, // Set the expiration time to 1 hour from now
        isAdmin: user?.isAdmin,
      };

      // Sign the token with the payload and your secret key
      const token = jwt.sign(payload, process.env.TOKEN_KEY);

      user.token = token;

      user.save();

      let resUser = { ...user._doc };

      resUser.TwoFAPerm = { permission: user?.TwoFA?.permission };

      let response = {
        status_code: 200,
        message: 'Anmeldung erfolgreich',
        data: resUser,
        subscription_status,
      };
      return res.status(200).send(response);
    }

    let response = {
      status_code: 400,
      message: 'Ungültige E-Mail oder Passwort',
    };
    return res.status(400).send(response);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const decodedOldToken = jwt.verify(token, process.env.TOKEN_KEY);

    const newClaims = {
      ...decodedOldToken,
      exp: Math.floor(Date.now() / 1000) + TimeForTokenExpire, // 1 hour from now
    };

    const newToken = jwt.sign(newClaims, process.env.TOKEN_KEY);

    if (newToken) {
      const user = await UserSchema.findOne({ _id: decodedOldToken?.user_id });
      user.token = newToken;
      await user.save();

      // TODO: ON LOGIN IF THE TRIAL PHASE IS OVER, SET TRIAL TO EXPIRED
      const subscription = await SubscriptionSchema.findOne({
        userId: user._id,
      });
      let subscription_status;
      if (dayjs().isAfter(user.trialEnd && !subscription)) {
        subscription_status = 'pending_subscription';
      }

      let response = {
        status_code: 200,
        data: user,
        subscription_status,
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 401,
        message: 'Token Expired',
      };
      return res.status(401).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const decodedToken = jwt.verify(
      req.headers['x-access-token'],
      process.env.TOKEN_KEY
    );
    const user_id = decodedToken?.user_id;
    const user = await UserSchema.findOne({ _id: user_id });
    user.token = null;
    if (user.save()) {
      let response = {
        status_code: 200,
        message: 'Abmelden erfolgreich',
      };
      return res.status(200).send(response);
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

const get = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const data = await UserSchema.findById(decodedToken?.user_id).select(
      ' -__v -token'
    );
    data.TwoFA = { permission: data.TwoFA.permission };
    console.log(data.TwoFA);
    if (data) {
      let response = {
        status_code: 200,
        message: 'Daten gefunden.',
        data: data,
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Benutzer nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const save = async (req, res, next) => {
  try {
    const requestBody = req.body;

    if (requestBody?.password) {
      const passwordStrength = zxcvbn(requestBody?.password);

      if (passwordStrength?.score < 3) {
        let response = {
          status_code: 400,
          message: 'Das Passwort sollte sicher sein',
        };
        return res.status(400).send(response);
      }
    }

    const userDetailsSchema = Joi.object({
      Anrede: Joi.string().required(),
      Titel: Joi.string(),
      Vorname: Joi.string().required(),
      Nachname: Joi.string().required(),
      Geburtsdatum: Joi.string().required(),
      Telefon: Joi.string().required(),
      Website: Joi.string().allow(''),
      Berufsbezeichnung: Joi.string().allow(''),
      Praxistitel: Joi.string().allow(''),
      Praxisbezeichnung: Joi.string().allow(''),
      Praxisbeschreibung: Joi.string().allow(''),
      Logo: Joi.string().allow(''),
      Primaerfarbe: Joi.string().allow(''),
      Strasse_und_Hausnummer: Joi.string().required(),
      Ort: Joi.string().required(),
      Land: Joi.string().required(),
      Steuernummer: Joi.string().required(),
      PLZ: Joi.string().required(),
      Bankname: Joi.string().required(),
      BIC: Joi.string().required(),
      IBAN: Joi.string().required(),
      invoiceEmail: Joi.string().email().allow(''),
      StandardSalesTax: Joi.string().allow(''),
      confirmPassword: Joi.string().allow(''),
      // password: Joi.string().allow(''),
      Authentifizierungscode: Joi.string().allow(''),
      TwoFaPermission: Joi.string().allow(''),
    });

    const { error } = userDetailsSchema.validate(req.body);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await UserSchema.findById(decodedToken?.user_id).select(
      ' -__v'
    );

    if (user) {
      let finalChiffre = user?.Chiffre;
      if (!user?.Chiffre) {
        const VornameLetters = requestBody?.Vorname.substring(
          0,
          2
        )?.toUpperCase();
        const NachnameLetters = requestBody?.Nachname.substring(
          0,
          2
        )?.toUpperCase();
        const Geburtsdatum = new Date(requestBody?.Geburtsdatum);
        const day = Geburtsdatum.getUTCDate().toString().padStart(2, '0');
        const month = (Geburtsdatum.getUTCMonth() + 1)
          .toString()
          .padStart(2, '0');
        const year = Geburtsdatum.getUTCFullYear().toString().substring(2);

        let chiffre = `${VornameLetters}${NachnameLetters}${day}${month}${year}`;
        const getChiffre = await UserSchema.find({
          Chiffre: { $regex: new RegExp(chiffre, 'i') },
        }).select('Chiffre');

        let nextChar = 'A';
        if (getChiffre?.length > 0) {
          const characters = getChiffre?.map(
            (item) => item.Chiffre.match(/([A-Z])$/)[1]
          );

          const maxChar = characters?.reduce(
            (max, char) => (char > max ? char : max),
            'A'
          );

          nextChar = String.fromCharCode(maxChar.charCodeAt(0) + 1);
        }
        finalChiffre = chiffre + nextChar;
      }
      // const encryptedPassword = await bcrypt.hash(requestBody?.password, 10);
      user.Anrede = requestBody?.Anrede;
      user.Titel = requestBody?.Titel;
      user.Vorname = requestBody?.Vorname;
      user.Nachname = requestBody?.Nachname;
      user.Chiffre = finalChiffre;
      user.Geburtsdatum = new Date(requestBody?.Geburtsdatum);
      user.Telefon = requestBody?.Telefon;
      user.Website = requestBody?.Website;
      user.Berufsbezeichnung = requestBody?.Berufsbezeichnung;
      user.Praxistitel = requestBody?.Praxistitel;
      user.Praxisbezeichnung = requestBody?.Praxisbezeichnung;
      user.Praxisbeschreibung = requestBody?.Praxisbeschreibung;
      user.Logo = requestBody?.Logo;
      user.Primaerfarbe = requestBody?.Primaerfarbe;
      user.Strasse_und_Hausnummer = requestBody?.Strasse_und_Hausnummer;
      user.Ort = requestBody?.Ort;
      user.Land = requestBody?.Land;
      user.Steuernummer = requestBody?.Steuernummer;
      user.PLZ = requestBody?.PLZ;
      user.Bankname = requestBody?.Bankname;
      user.BIC = requestBody?.BIC;
      user.IBAN = requestBody?.IBAN;
      user.invoiceEmail = requestBody?.invoiceEmail;
      user.StandardSalesTax = requestBody?.StandardSalesTax;
      user.confirmPassword = requestBody?.confirmPassword;
      // user.password = encryptedPassword;
      user.Authentifizierungscode = requestBody?.Authentifizierungscode;
      user.isAdmin = 0;

      // 2fa setup
      if (user.TwoFA) {
        if (requestBody?.TwoFaPermission === 'Yes') {
          user.TwoFA.permission = true;
          await UserSchema.findByIdAndUpdate(decodedToken?.user_id, {
            TwoFA: user.TwoFA,
          });
          const { base32: secret } = user.TwoFA?.secret;
          let contactObject = {
            email: user.email,
            name: 'psymax',
          };
          const code = secret;
          console.log('email ', code);
          const subject = 'two factor authentication';
          let sent;
          try {
            sent = await sendSMTPMail(user.email, subject, code);
          } catch (error) {
            const mailer = new Email(contactObject);
            sent = await mailer.send('two factor authentication', code);
          }
        } else if (requestBody?.TwoFaPermission === 'No') {
          user.TwoFA.permission = false;
          await UserSchema.findByIdAndUpdate(decodedToken?.user_id, {
            TwoFA: user.TwoFA,
          });
        }
      }
      // user.isFirst = 0;
      await user.save();
      let resUser = { ...user._doc };
      delete resUser.TwoFA;

      let response = {
        status_code: 200,
        message: 'Daten aktualisiert',
        data: resUser,
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Benutzer nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const saveLogo = async (req, res, next) => {
  try {
    const logoSchema = Joi.object({
      logo: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        destination: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
          .valid('image/png', 'image/svg+xml')
          .required()
          .messages({
            'any.only': 'Nur PNG und SVG Dateien sind erlaubt',
          }),
        size: Joi.number().max(300000).required().messages({
          'number.max': 'Ihre Datei ist zu groß (maximal 0.3 MB)',
        }),
        filename: Joi.string().required(),
        path: Joi.string().required(),
      }).required(),
      deleteFile: Joi.string().allow(''), // Optional, if you want to delete a file
    });

    const { error } = logoSchema.validate({
      logo: req.file,
      deleteFile: req.body.deleteFile,
    });

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const filename = req?.file?.filename;

    if (!req?.file) {
      let response = {
        status_code: 400,
        message: 'Keine Datei hochgeladen',
        data: filename,
      };
      return res.status(400).send(response);
    }

    if (req?.body?.deleteFile) {
      const absoluteFilePath =
        __dirname + '/../public/uploads/logo/' + req?.body?.deleteFile;
      if (fs.existsSync(absoluteFilePath)) {
        fs.unlinkSync(absoluteFilePath);
      }
    }

    let response = {
      status_code: 200,
      message: 'Datei hochgeladen',
      data: filename,
    };
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};
const TwoFaAuth = async (req, res, next) => {
  try {
    const code = req.body?.code;
    const userId = req.body?.userId;
    const userEmail = req.body?.email;

    let user;
    console.log(userId);

    if (userId !== undefined) {
      user = await UserSchema.findOne({ _id: userId });
    }

    if (userEmail) {
      user = await UserSchema.findOne({ email: userEmail });
    }
    if (user) {
      console.log(user.email);
      let contactObject = {
        email: user.email,
        name: 'psymax',
      };

      const subject = 'two factor authentication';
      let sent;
      try {
        sent = await sendSMTPMail(user.email, subject, code);
      } catch (error) {
        const mailer = new Email(contactObject);
        sent = await mailer.send('two factor authentication', code);
      }

      // send target email
      // console.log(sent);

      if (sent?.status === 'success' || sent?.response.startsWith('250')) {
        console.log('sent');
        return res.status(200).json({
          status: 'success',
          message: 'sent',
          data: {
            userId: user._id,
          },
        });
      } else {
        throw new Error('failed');
      }
    } else {
      throw new Error('no user found.');
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }
};

const validateRecoveryPhrase = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const recoveryPhrase = req.body.phrase;
    const user = await UserSchema.findOne({ _id: userId });
    if (user) {
      let phrase = user.recoveryPhrase;
      const isMatch = await bcrypt.compare(recoveryPhrase, phrase);
      if (isMatch) {
        return res.status(200).json({
          status: 'success',
          data: { userId },
        });
      } else {
        throw new Error('not a match');
      }
    } else {
      throw new Error('no user found');
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const newPassword = req.body.password;

    const passwordStrength = zxcvbn(newPassword);

    if (passwordStrength?.score < 3) {
      let response = {
        status_code: 400,
        message: 'Das Passwort sollte sicher sein',
      };
      return res.status(400).send(response);
    }

    const user = await UserSchema.findOne({ _id: userId });

    if (user && newPassword) {
      const newPassHash = await bcrypt.hash(newPassword, 10);
      const oldPasswordHash = user.password;
      const emergencyPasswordHash = user.emergencyPassword;

      if (oldPasswordHash && emergencyPasswordHash && newPassHash) {
        let vault = await UserVault.find({ userId: userId });
        let clientVault = await ClientVault.find({ userId: userId });
        let serverVault = await ServerVault.find();

        if (vault.length === 3 && clientVault.length === 3 && serverVault[0]) {
          user.password = newPassHash;
          await user.save();

          return res.status(200).json({
            status: 'success',
            data: {
              fileVaults: vault,
              clientVaults: clientVault,
              serverVault: serverVault,
              oldPasswordHash: oldPasswordHash,
              emergencyPassword: user.emergencyPassword,
              newPassword: newPassHash,
            },
          });
        }
      } else {
        throw new Error('failed to update password');
      }
    } else {
      throw new Error('no user or new password available');
    }
  } catch (error) {
    next(error);
  }
};

const verifySecret = async (req, res) => {
  try {
    let { token, userId, time } = req.body;
    const user = await UserSchema.findOne({ _id: userId });
    time = Date.now();

    if (user) {
      const { base32: secret } = user.TwoFA?.secret;
      console.log(time);
      const timSent = speakeasy.time({
        secret,
        encoding: 'base32',
        token,
        window: 60,
      });
      let token2 = speakeasy.totp({
        secret: secret,
        encoding: 'base32',
        token,
        window: 60,
      });
      console.log(timSent);
      console.log(token, ' recieved');
      console.log(token2, ' expected');
      console.log(secret);
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token,
        window: 60,
      });
      console.log(verified);
      if (verified) {
        return res.status(200).json({
          status: 'sucess',
          message: 'TwoFa verification sucessful',
          token,
          verified,
        });
      } else {
        throw new Error('failed to verify');
      }
    }

    throw new Error('failed to verify');
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 'failed', message: 'TwoFa verification failed' });
  }
};

const getSecret = async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

    console.log(decodedToken.user_id);
    const user = await UserSchema.findOne({ _id: decodedToken.user_id });

    if (user) {
      const { base32: secret } = user.TwoFA?.secret;
      console.log(secret);

      return res.status(200).json({
        status: 'sucess',
        message: 'Found text',
        data: { text: secret },
      });
    }

    throw new Error('failed to find text');
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 'failed', message: 'error occured.' });
  }
};
const emailSecret = async (req, res) => {
  try {
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

    console.log(decodedToken.user_id);
    const user = await UserSchema.findOne({ _id: decodedToken.user_id });

    if (user) {
      console.log(user.email);
      const { base32: secret } = user.TwoFA?.secret;
      let contactObject = {
        email: user.email,
        name: 'psymax',
      };
      const code = secret;
      console.log('email ', code);
      const subject = 'two factor authentication';
      let sent;
      try {
        sent = await sendSMTPMail(user.email, subject, code);
      } catch (error) {
        const mailer = new Email(contactObject);
        sent = await mailer.send('two factor authentication', code);
      }

      // send target email
      // console.log(sent);

      if (sent?.status === 'success' || sent?.response.startsWith('250')) {
        console.log('sent');
        return res.status(200).json({
          status: 'success',
          message: 'sent',
          data: {
            userId: user._id,
          },
        });
      } else {
        throw new Error('failed');
      }
    } else {
      throw new Error('no user found.');
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 'failed', message: 'error occured.' });
  }
};

const getTwoFaStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const user = await UserSchema.findOne({ _id: id });
    if (user) {
      const { permission } = user?.TwoFA;
      return res.status(200).json({
        status: 'success',
        message: 'sent',
        data: {
          twoFaStatus: permission,
        },
      });
    } else {
      throw new Error('no user found');
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: 'failed', message: 'error occured.' });
  }
};
module.exports = {
  register,
  login,
  refreshToken,
  logout,
  get,
  save,
  saveLogo,
  TwoFaAuth,
  validateRecoveryPhrase,
  resetPassword,
  verifySecret,
  getSecret,
  emailSecret,
  getTwoFaStatus,
};
