const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { KlientSchema } = require('../models/klientModel');
const { ArztSchema } = require('../models/arztModel');
const { PAGINATION_LIMIT } = require('../utils/constants');
const { UserSchema } = require('../models/userModel');

const getActive = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(
      token,
      '09t37e602636e2fba8da5097a35f1B20d6c032c60'
    );

    // Extract page and pageSize from query parameters, default to 1 and 10 if not provided
    const page = parseInt(req.query.page, PAGINATION_LIMIT) || 1;
    const pageSize =
      parseInt(req.query.pageSize, PAGINATION_LIMIT) || PAGINATION_LIMIT;

    const skip = (page - 1) * pageSize;

    // Fetch total count of data
    const totalCount = await KlientSchema.countDocuments({
      userId: decodedToken?.user_id,
      isDeleted: 0,
      status: 1,
    });

    // Fetch paginated data
    const list = await KlientSchema.find({
      userId: decodedToken?.user_id,
      isDeleted: 0,
      status: 1,
    })
      .select('-__v -isDeleted -status -ArztId')
      .skip(skip)
      .limit(pageSize);

    if (list) {
      let response = {
        status_code: 200,
        message: 'Daten gefunden.',
        data: { list, totalCount, page, pageSize },
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Daten nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const getArchived = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(
      token,
      '09t37e602636e2fba8da5097a35f1B20d6c032c60'
    );

    // Extract page and pageSize from query parameters, default to 1 and 10 if not provided
    const page = parseInt(req.query.page, PAGINATION_LIMIT) || 1;
    const pageSize =
      parseInt(req.query.pageSize, PAGINATION_LIMIT) || PAGINATION_LIMIT;

    const skip = (page - 1) * pageSize;

    // Fetch total count of data
    const totalCount = await KlientSchema.countDocuments({
      userId: decodedToken?.user_id,
      isDeleted: 0,
      status: 2,
    });

    // Fetch paginated data
    const list = await KlientSchema.find({
      userId: decodedToken?.user_id,
      isDeleted: 0,
      status: 2,
    })
      .select('-__v -isDeleted -status -ArztId')
      .skip(skip)
      .limit(pageSize);

    if (list) {
      let response = {
        status_code: 200,
        message: 'Daten gefunden.',
        data: { list, totalCount, page, pageSize },
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Daten nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const getNew = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(
      token,
      '09t37e602636e2fba8da5097a35f1B20d6c032c60'
    );

    // Extract page and pageSize from query parameters, default to 1 and 10 if not provided
    const page = parseInt(req.query.page, PAGINATION_LIMIT) || 1;
    const pageSize =
      parseInt(req.query.pageSize, PAGINATION_LIMIT) || PAGINATION_LIMIT;

    const skip = (page - 1) * pageSize;

    // Fetch total count of data
    const totalCount = await KlientSchema.countDocuments({
      userId: decodedToken?.user_id,
      isDeleted: 0,
      status: 3,
    });

    // Fetch paginated data
    const list = await KlientSchema.find({
      userId: decodedToken?.user_id,
      isDeleted: 0,
      status: 3,
    })
      .select('-__v -isDeleted -status -ArztId')
      .skip(skip)
      .limit(pageSize);

    if (list) {
      let response = {
        status_code: 200,
        message: 'Daten gefunden.',
        data: { list, totalCount, page, pageSize },
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Daten nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(
      token,
      '09t37e602636e2fba8da5097a35f1B20d6c032c60'
    );

    const list = await KlientSchema.find({
      userId: decodedToken?.user_id,
      isDeleted: 0,
    }).select('-__v -isDeleted -status -ArztId');

    if (list) {
      let response = {
        status_code: 200,
        message: 'Daten gefunden.',
        data: list,
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Daten nicht gefunden',
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

    const klientSchema = Joi.object({
      email: Joi.string().email().required(),
      Anrede: Joi.array().required(),
      isEncrypted: Joi.boolean().required(),
      Titel: Joi.array().allow(''),
      Firma: Joi.array().required(),
      Chiffre: Joi.string().required(),
      Vorname: Joi.array().required(),
      Nachname: Joi.array().required(),
      Strasse_und_Hausnummer: Joi.array().required(),
      PLZ: Joi.array().required(),
      Ort: Joi.array().required(),
      Land: Joi.array().required(),
      Telefonnummer: Joi.string().required(),
      Diagnose: Joi.array().required(),
      Geburtsdatum: Joi.array().required(),
      ArztAnrede: Joi.array().required(),
      ArztTitel: Joi.array().allow(''),
      ArztEmail: Joi.string().email().required(),
      ArztVorname: Joi.array().required(),
      ArztNachname: Joi.array().required(),
      ArztStrasse_und_Hausnummer: Joi.array().required(),
      ArztPLZ: Joi.array().required(),
      ArztOrt: Joi.array().required(),
      ArztLand: Joi.array().required(),
      ArztTelefonnummer: Joi.string().required(),
    });

    const { error } = klientSchema.validate(req.body);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
        data: error,
      };
      return res.status(400).send(response);
    }

    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(
      token,
      '09t37e602636e2fba8da5097a35f1B20d6c032c60'
    );

    const CheckKlientExist = await KlientSchema.findOne({
      email: requestBody?.email,
      userId: decodedToken?.user_id,
      isDeleted: 0,
    }).exec();
    if (!CheckKlientExist) {
      const getChiffre = await KlientSchema.findOne({
        Chiffre: requestBody?.Chiffre,
        userId: decodedToken?.user_id,
      }).select('Chiffre');

      if (!getChiffre) {
        const doctor = await ArztSchema.findOne({
          email: requestBody?.ArztEmail,
        })
          .select(' -__v')
          .exec();

        let doctorData;

        if (doctor) {
          // Update existing doctor
          doctor.Anrede = requestBody?.ArztAnrede;
          doctor.Titel = requestBody?.ArztTitel;
          doctor.Strasse_und_Hausnummer =
            requestBody?.ArztStrasse_und_Hausnummer;
          doctor.PLZ = requestBody?.ArztPLZ;
          doctor.Ort = requestBody?.ArztOrt;
          doctor.Land = requestBody?.ArztLand;
          doctor.Telefonnummer = requestBody?.ArztTelefonnummer;

          await doctor.save();
          doctorData = doctor;
        } else {
          // Create a new doctor
          const newDoctor = new ArztSchema({
            email: requestBody?.ArztEmail,
            Anrede: requestBody?.ArztAnrede,
            Titel: requestBody?.ArztTitel,
            Vorname: requestBody?.ArztVorname,
            Nachname: requestBody?.ArztNachname,
            Strasse_und_Hausnummer: requestBody?.ArztStrasse_und_Hausnummer,
            PLZ: requestBody?.ArztPLZ,
            Ort: requestBody?.ArztOrt,
            Land: requestBody?.ArztLand,
            Telefonnummer: requestBody?.ArztTelefonnummer,
          });

          const savedDoctor = await newDoctor.save();
          doctorData = savedDoctor;
        }

        if (doctorData) {
          const userData = await UserSchema.findById(decodedToken?.user_id);
          // Create a new klient
          const newKlient = new KlientSchema({
            userId: decodedToken?.user_id,
            userChiffre: userData?.Chiffre,
            email: requestBody?.email,
            Chiffre: requestBody?.Chiffre,
            Anrede: requestBody?.Anrede,
            Titel: requestBody?.Titel,
            Firma: requestBody?.Firma,
            Vorname: requestBody?.Vorname,
            Nachname: requestBody?.Nachname,
            Strasse_und_Hausnummer: requestBody?.Strasse_und_Hausnummer,
            PLZ: requestBody?.PLZ,
            Ort: requestBody?.Ort,
            Land: requestBody?.Land,
            Telefonnummer: requestBody?.Telefonnummer,
            Diagnose: requestBody?.Diagnose,
            Geburtsdatum: requestBody?.Geburtsdatum,
            ArztId: doctorData?._id,
            isEncrypted: requestBody?.isEncrypted,
          });
          await newKlient.save();

          const finalData = {
            ...newKlient.toObject(),
            Arztemail: doctorData?.Email,
            ArztAnrede: doctorData?.Anrede,
            ArztTitel: doctorData?.Titel,
            ArztVorname: doctorData?.Vorname,
            ArztNachname: doctorData?.Nachname,
            ArztStrasse_und_Hausnummer: doctorData?.Strasse_und_Hausnummer,
            ArztPLZ: doctorData?.PLZ,
            ArztOrt: doctorData?.Ort,
            ArztLand: doctorData?.Land,
            ArztTelefonnummer: doctorData?.Telefonnummer,
          };

          delete finalData?.createdAt;
          delete finalData?.isDeleted;
          delete finalData?.ArztId;
          delete finalData?.status;
          delete finalData?.__v;

          let response = {
            status_code: 200,
            message: 'Klient hinzugefügt',
            data: finalData,
          };
          return res.status(200).send(response);
        } else {
          let response = {
            status_code: 400,
            message: 'Problem beim Hinzufügen eines Arztes',
          };
          return res.status(400).send(response);
        }
      } else {
        let response = {
          status_code: 400,
          message: 'Chiffre existiert bereit',
        };
        return res.status(400).send(response);
      }
    } else {
      let response = {
        status_code: 400,
        message: 'E-Mail existiert bereit',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const klientSchema = Joi.object({
      id: Joi.string().required(),
    });

    const { error } = klientSchema.validate(req.params);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const klient = await KlientSchema.findOne({
      _id: id,
      isDeleted: 0,
    })
      .select(' -__v -isDeleted')
      .populate({
        path: 'ArztId',
        model: 'arzt',
        select: '-__v -isDeleted',
      });

    if (klient) {
      let response = {
        status_code: 200,
        message: 'Klient Aktualisiert',
        data: klient,
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Klient nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const requestBody = req.body;

    const klientSchema = Joi.object({
      id: Joi.string().required(),
      email: Joi.string().email().required(),
      Anrede: Joi.array().required(),
      isEncrypted: Joi.boolean().required(),
      Titel: Joi.array().allow(''),
      Firma: Joi.array().required(),
      // Chiffre: Joi.string().required(),
      Vorname: Joi.array().required(),
      Nachname: Joi.array().required(),
      Strasse_und_Hausnummer: Joi.array().required(),
      PLZ: Joi.array().required(),
      Ort: Joi.array().required(),
      Land: Joi.array().required(),
      Telefonnummer: Joi.string().required(),
      Diagnose: Joi.array().required(),
      Geburtsdatum: Joi.array().required(),
      ArztAnrede: Joi.array().required(),
      ArztTitel: Joi.array().allow(''),
      ArztEmail: Joi.string().email().required(),
      ArztVorname: Joi.array().required(),
      ArztNachname: Joi.array().required(),
      ArztStrasse_und_Hausnummer: Joi.array().required(),
      ArztPLZ: Joi.array().required(),
      ArztOrt: Joi.array().required(),
      ArztLand: Joi.array().required(),
      ArztTelefonnummer: Joi.string().required(),
    });

    const { error } = klientSchema.validate(req.body);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
        data: error,
      };
      return res.status(400).send(response);
    }

    /*  const existingChiffre = await KlientSchema.findOne({
      Chiffre: requestBody?.Chiffre,
      _id: { $ne: requestBody?.id },
    }).select('Chiffre');

    if (existingChiffre) {
      let response = {
        status_code: 400,
        message: 'Chiffre existiert bereits',
      };
      return res.status(400).send(response);
    } */

    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(
      token,
      '09t37e602636e2fba8da5097a35f1B20d6c032c60'
    );

    const CheckKlientExist = await KlientSchema.findOne({
      _id: requestBody?.id,
    }).exec();

    if (CheckKlientExist) {
      const doctor = await ArztSchema.findOne({ email: requestBody?.ArztEmail })
        .select(' -__v')
        .exec(); // Add .exec() to execute the query

      let doctorData;

      if (doctor) {
        // Update existing doctor
        doctor.Anrede = requestBody?.ArztAnrede;
        doctor.Titel = requestBody?.ArztTitel;
        doctor.Strasse_und_Hausnummer = requestBody?.ArztStrasse_und_Hausnummer;
        doctor.PLZ = requestBody?.ArztPLZ;
        doctor.Ort = requestBody?.ArztOrt;
        doctor.Land = requestBody?.ArztLand;
        doctor.Telefonnummer = requestBody?.ArztTelefonnummer;

        await doctor.save();
        doctorData = doctor;
      } else {
        // Create a new doctor
        const newDoctor = new ArztSchema({
          email: requestBody?.ArztEmail,
          Anrede: requestBody?.ArztAnrede,
          Titel: requestBody?.ArztTitel,
          Vorname: requestBody?.ArztVorname,
          Nachname: requestBody?.ArztNachname,
          Strasse_und_Hausnummer: requestBody?.ArztStrasse_und_Hausnummer,
          PLZ: requestBody?.ArztPLZ,
          Ort: requestBody?.ArztOrt,
          Land: requestBody?.ArztLand,
          Telefonnummer: requestBody?.ArztTelefonnummer,
        });

        const savedDoctor = await newDoctor.save();
        doctorData = savedDoctor;
      }

      let email;
      if (requestBody?.email !== CheckKlientExist?.email) {
        const CheckEmailExist = await KlientSchema.findOne({
          _id: { $ne: requestBody?.id },
          email: requestBody?.email,
          userId: decodedToken?.user_id,
          isDeleted: 0,
        }).exec();
        if (CheckEmailExist) {
          let response = {
            status_code: 400,
            message: 'E-Mail existiert bereit',
          };
          return res.status(400).send(response);
        }
        email = requestBody?.email;
      } else {
        email = CheckKlientExist?.email;
      }
      if (doctorData) {
        // Update klient
        CheckKlientExist.email = email;
        // CheckKlientExist.Chiffre = requestBody?.Chiffre;
        CheckKlientExist.Anrede = requestBody?.Anrede;
        CheckKlientExist.Titel = requestBody?.Titel;
        CheckKlientExist.Firma = requestBody?.Firma;
        CheckKlientExist.Vorname = requestBody?.Vorname;
        CheckKlientExist.Nachname = requestBody?.Nachname;
        CheckKlientExist.Strasse_und_Hausnummer =
          requestBody?.Strasse_und_Hausnummer;
        CheckKlientExist.PLZ = requestBody?.PLZ;
        CheckKlientExist.Ort = requestBody?.Ort;
        CheckKlientExist.Land = requestBody?.Land;
        CheckKlientExist.Telefonnummer = requestBody?.Telefonnummer;
        CheckKlientExist.Diagnose = requestBody?.Diagnose;
        CheckKlientExist.Geburtsdatum = requestBody?.Geburtsdatum;
        CheckKlientExist.ArztId = doctorData?._id;

        await CheckKlientExist.save();

        const finalData = {
          ...CheckKlientExist.toObject(),
          Arztemail: doctorData?.Email,
          ArztAnrede: doctorData?.Anrede,
          ArztTitel: doctorData?.Titel,
          ArztVorname: doctorData?.Vorname,
          ArztNachname: doctorData?.Nachname,
          ArztStrasse_und_Hausnummer: doctorData?.Strasse_und_Hausnummer,
          ArztPLZ: doctorData?.PLZ,
          ArztOrt: doctorData?.Ort,
          ArztLand: doctorData?.Land,
          ArztTelefonnummer: doctorData?.Telefonnummer,
        };

        delete finalData?.createdAt;
        delete finalData?.isDeleted;
        delete finalData?.ArztId;
        delete finalData?.status;
        delete finalData?.__v;

        let response = {
          status_code: 200,
          message: 'Klient hinzugefügt',
          data: finalData,
        };
        return res.status(200).send(response);
      } else {
        let response = {
          status_code: 400,
          message: 'Problem beim Hinzufügen eines Arztes',
        };
        return res.status(400).send(response);
      }
    } else {
      let response = {
        status_code: 400,
        message: 'Klient nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const klientSchema = Joi.object({
      id: Joi.string().required(),
    });

    const { error } = klientSchema.validate(req.params);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const decodedToken = jwt.verify(
      req.headers['x-access-token'],
      '09t37e602636e2fba8da5097a35f1B20d6c032c60'
    );

    const klient = await KlientSchema.findOne({
      _id: id,
      isDeleted: 0,
    });
    const decodedObjectId = new ObjectId(decodedToken?.user_id);

    if (
      klient &&
      (klient?.userId.equals(decodedObjectId) || decodedToken?.isAdmin === 1)
    ) {
      klient.isDeleted = 1;
      klient.deletedAt = new Date();
      klient.save();
      let response = {
        status_code: 200,
        message: 'Klient Aktualisiert',
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Klient nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const getChiffre = async (req, res, next) => {
  try {
    const klientSchema = Joi.object({
      Vorname: Joi.string().required(),
      Nachname: Joi.string().required(),
      Geburtsdatum: Joi.string().required(),
    });

    const { error } = klientSchema.validate(req.body);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(
      token,
      '09t37e602636e2fba8da5097a35f1B20d6c032c60'
    );

    const requestBody = req.body;

    const VornameLetters = requestBody?.Vorname.substring(0, 2)?.toUpperCase();
    const NachnameLetters = requestBody?.Nachname.substring(
      0,
      2
    )?.toUpperCase();
    const Geburtsdatum = new Date(requestBody?.Geburtsdatum);

    const day = Geburtsdatum.getUTCDate().toString().padStart(2, '0');
    const month = (Geburtsdatum.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = Geburtsdatum.getUTCFullYear().toString().substring(2);

    let chiffre = `${VornameLetters}${NachnameLetters}${day}${month}${year}`;
    const getChiffre = await KlientSchema.find({
      Chiffre: { $regex: new RegExp(chiffre, 'i') },
      userId: decodedToken?.user_id,
    }).select('Chiffre');

    let nextChar = 'A';
    let finalChiffre = '';
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

    let response = {
      status_code: 200,
      message: 'Chiffre generated',
      data: finalChiffre,
    };
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    const klientSchema = Joi.object({
      ids: Joi.array().required(),
      status: Joi.number().valid(1, 2).required(),
    });

    const { error } = klientSchema.validate(req.body);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const requestBody = req.body;

    const updateResult = await KlientSchema.updateMany(
      { _id: { $in: requestBody?.ids } },
      { $set: { status: requestBody?.status } }
    );

    if (updateResult) {
      let response = {
        status_code: 200,
        message: 'Aktualisiert',
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Error !!!',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const updateExcludeInQuestionnaire = async (req, res, next) => {
  try {
    const requestArray = req.body;

    const klientSchema = Joi.object({
      id: Joi.string().required(),
      excludeInQuestionnaire: Joi.boolean().required(),
    });

    const { error } = Joi.array().items(klientSchema).validate(requestArray);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
        data: error,
      };
      return res.status(400).send(response);
    }

    const updatePromises = requestArray.map(async (requestItem) => {
      const CheckKlientExist = await KlientSchema.findOne({
        _id: requestItem.id,
      }).exec();

      if (CheckKlientExist) {
        // Update klient
        CheckKlientExist.excludeInQuestionnaire =
          requestItem.excludeInQuestionnaire;

        await CheckKlientExist.save();
      } else {
        let response = {
          status_code: 400,
          message: `Klient with ID ${requestItem.id} not found`,
        };
        return res.status(400).send(response);
      }
    });

    await Promise.all(updatePromises);

    let response = {
      status_code: 200,
      message: 'Klient(s) Aktualisiert',
    };
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActive,
  getArchived,
  getNew,
  getAll,
  save,
  getById,
  update,
  remove,
  getChiffre,
  changeStatus,
  updateExcludeInQuestionnaire,
};
