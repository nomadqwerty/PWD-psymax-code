const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserSchema } = require('../models/userModel');
const Joi = require('joi');
const UserVault = require('../models/UserVault');
const {
  TimeForTokenExpire,
  GLOBAL_POINT_VALUE,
} = require('../utils/constants');
const { randomCodeStr } = require('../utils/common');
const fs = require('fs');
const zxcvbn = require('zxcvbn');
const { GlobalPointsSchema } = require('../models/globalPointsModel');
const Email = require('./contactUtil/contactUtil')

const register = async (req, res, next) => {
  try {
    const { email, password, inviteCode, emergencyPassword, recoveryPhrase } = req.body;
    const passwordStrength = zxcvbn(password);

    if (passwordStrength?.score < 3) {
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
      inviteCode: Joi.string().required(),
      emergencyPassword: Joi.string(),
      recoveryPhrase: Joi.string(),
    });
    
    const { error } = registrationSchema.validate(req.body);
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


    const getInvitedUser = UserSchema.findOne({ inviteCode: inviteCode });

    const randomCode = randomCodeStr(4);

    const user = new UserSchema({
      email: email.toLowerCase(),
      password: encryptedPassword,
      confirmPassword: password,
      inviteCode: randomCode,
      invitedUserId: getInvitedUser?._id ? getInvitedUser?._id : null,
      isAdmin: 0,
      emergencyPassword: encryptedEmergencyPassword,
      recoveryPhrase: encryptedRecoveryPhrase
    });
    await user.save();
    if (user) {
      const globalPointsSchema = new GlobalPointsSchema({
        userId: user?._id,
        value: GLOBAL_POINT_VALUE,
      });
      await globalPointsSchema.save();
    }

    let response = {
      status_code: 200,
      message: 'Registrierung erfolgreich.',
      data:{userId: user?._id,}
    };
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // Get user input

    const { email, password } = req.body;
    // console.log('incoming', email, password);
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
    const user = await UserSchema.findOne({
      email: email,
    }).select(' -__v');
    // console.log(user);
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

      let response = {
        status_code: 200,
        message: 'Anmeldung erfolgreich',
        data: user,
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
      let response = {
        status_code: 200,
        data: user,
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

// TODO:
const save = async (req, res, next) => {
  try {
    const requestBody = req.body;

    if (requestBody?.password) {
      // TODO: fix vault errors based on password change: Account recovery
      // const passwordStrength = zxcvbn(requestBody?.password);

      // if (passwordStrength?.score < 3) {
      //   let response = {
      //     status_code: 400,
      //     message: 'Das Passwort sollte sicher sein',
      //   };
      //   return res.status(400).send(response);
      // }
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
      // user.isFirst = 0;
     

      // TODO: Create user Access Key Document.
      user.save();

      let response = {
        status_code: 200,
        message: 'Daten aktualisiert',
        data: user,
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
    const code = req.body.code;
  
    let contactObject = {
      email:'davexmike72@gmail.com',
      name: 'psymax',
    };
    console.log(code);

    const mailer = new Email(contactObject)
    const sent = await mailer.send('two factor authentication', code)

    // send target email
    if (sent?.status === "success" || sent?.response.startsWith("250")) {
      console.log('sent');
      return res.status(200).send('done');
    }else{
      throw new Error('failed')
    }
    
  } catch (error) {
    next(error);
  }
}
module.exports = {
  register,
  login,
  refreshToken,
  logout,
  get,
  save,
  saveLogo,
  TwoFaAuth
};
