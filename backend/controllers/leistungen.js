const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { PAGINATION_LIMIT, GLOBAL_POINT_VALUE } = require('../utils/constants');
const {
  AbrechnungLeistungSchema,
} = require('../models/abrechnungLeistungModel');
const {
  TerminplanungLeistungSchema,
} = require('../models/terminplanungLeistungModel');
const { GlobalPointsSchema } = require('../models/globalPointsModel');

/* Abrechnung */
const getAllAbrechnung = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

    // Extract page, pageSize, and search from query parameters, default to 1, 10, and null if not provided
    const page = parseInt(req.query.page, PAGINATION_LIMIT) || 1;
    const pageSize =
      parseInt(req.query.pageSize, PAGINATION_LIMIT) || PAGINATION_LIMIT;
    const search = req.query.search || null;

    const skip = (page - 1) * pageSize;

    const query = {
      userId: decodedToken?.user_id,
      isDeleted: 0,
    };

    let list = [];
    let totalCount = 0;
    if (search !== null) {
      let allData = await AbrechnungLeistungSchema.find(query).select('-__v');
      const regex = new RegExp(search, 'i');

      list = allData.filter((item) => regex.test(item.Leistung));
      totalCount = list?.length;
      list = list.slice(skip, skip + pageSize);
    } else {
      list = await AbrechnungLeistungSchema.find(query)
        .select('-__v')
        .skip(skip)
        .limit(pageSize);
      totalCount = await AbrechnungLeistungSchema.countDocuments(query);
    }

    let response = {
      status_code: 200,
      message: 'Daten gefunden.',
      data: { list, totalCount, page, pageSize },
    };
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const saveAbrechnung = async (req, res, next) => {
  try {
    console.log('here');
    const requestBody = req.body;
    const leistungObjectSchema = Joi.object({
      Leistung: Joi.string().required(),
      GopNr: Joi.string().required(),
      Punktwert: Joi.number().required(),
      Leistungsbeschreibung: Joi.string().required(),
      Standardanzahl: Joi.number().required(),
      Standardfaktor: Joi.number().required(),
      Betrag: Joi.number().required(),
      ManuellerBetrag: Joi.number().required(),
      Umsatzsteuerwahl: Joi.string().required(),
    });

    const { error } = leistungObjectSchema.validate(req.body);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const decodedToken = jwt.verify(
      req.headers['x-access-token'],
      process.env.TOKEN_KEY
    );

    const leistung = new AbrechnungLeistungSchema({
      userId: decodedToken?.user_id,
      Leistung: requestBody?.Leistung,
      GopNr: requestBody?.GopNr,
      Punktwert: requestBody?.Punktwert,
      Leistungsbeschreibung: requestBody?.Leistungsbeschreibung,
      Standardanzahl: requestBody?.Standardanzahl,
      Standardfaktor: requestBody?.Standardfaktor,
      Betrag: requestBody?.Betrag,
      ManuellerBetrag: requestBody?.ManuellerBetrag,
      Umsatzsteuerwahl: requestBody?.Umsatzsteuerwahl,
    });
    await leistung.save();

    if (leistung) {
      let response = {
        status_code: 200,
        message: 'Leistung hinzugefügt',
        data: leistung,
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

const getAbrechnungById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leistungSchema = Joi.object({
      id: Joi.string().required(),
    });

    const { error } = leistungSchema.validate(req.params);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const leistung = await AbrechnungLeistungSchema.findOne({
      _id: id,
      isDeleted: 0,
    }).select(' -__v -isDeleted');

    if (leistung) {
      let response = {
        status_code: 200,
        message: 'Leistung Aktualisiert',
        data: leistung,
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Leistung nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const updateAbrechnung = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const leistungObjectSchema = Joi.object({
      id: Joi.string().required(),
      Leistung: Joi.string().required(),
      GopNr: Joi.string().required(),
      Punktwert: Joi.number().required(),
      Leistungsbeschreibung: Joi.string().required(),
      Standardanzahl: Joi.number().required(),
      Standardfaktor: Joi.number().required(),
      Betrag: Joi.number().required(),
      ManuellerBetrag: Joi.number().required(),
      Umsatzsteuerwahl: Joi.string().required(),
    });

    const { error } = leistungObjectSchema.validate(req.body);
    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const updateAbrechnungLeistung = await AbrechnungLeistungSchema?.findOne({
      _id: requestBody?.id,
      isDeleted: 0,
    });

    if (updateAbrechnungLeistung) {
      updateAbrechnungLeistung.Leistung = requestBody?.Leistung;
      updateAbrechnungLeistung.GopNr = requestBody?.GopNr;
      updateAbrechnungLeistung.Punktwert = requestBody?.Punktwert;
      updateAbrechnungLeistung.Leistungsbeschreibung =
        requestBody?.Leistungsbeschreibung;
      updateAbrechnungLeistung.Standardanzahl = requestBody?.Standardanzahl;
      updateAbrechnungLeistung.Standardfaktor = requestBody?.Standardfaktor;
      updateAbrechnungLeistung.Betrag = requestBody?.Betrag;
      updateAbrechnungLeistung.ManuellerBetrag = requestBody?.ManuellerBetrag;
      updateAbrechnungLeistung.Umsatzsteuerwahl = requestBody?.Umsatzsteuerwahl;
      if (updateAbrechnungLeistung.save()) {
        let response = {
          status_code: 200,
          message: 'Leistung Aktualisiert',
        };
        return res.status(200).send(response);
      }
    } else {
      let response = {
        status_code: 400,
        message: 'Leistung nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const abrechnungRemove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leistungObjectSchema = Joi.object({
      id: Joi.string().required(),
    });

    const { error } = leistungObjectSchema.validate(req.params);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const decodedToken = jwt.verify(
      req.headers['x-access-token'],
      process.env.TOKEN_KEY
    );

    const abrechnungLeistung = await AbrechnungLeistungSchema.findOne({
      _id: id,
      isDeleted: 0,
    });
    const decodedObjectId = new ObjectId(decodedToken?.user_id);

    if (
      abrechnungLeistung &&
      (abrechnungLeistung?.userId.equals(decodedObjectId) ||
        decodedToken?.isAdmin === 1)
    ) {
      abrechnungLeistung.isDeleted = 1;
      abrechnungLeistung.deletedAt = new Date();
      abrechnungLeistung.save();
      let response = {
        status_code: 200,
        message: 'Leistung Aktualisiert',
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Leistung nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

/* Terminplanung  */
const getAllTerminplanung = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

    // Extract page, pageSize, and search from query parameters, default to 1, 10, and null if not provided
    const page = parseInt(req.query.page, PAGINATION_LIMIT) || 1;
    const pageSize =
      parseInt(req.query.pageSize, PAGINATION_LIMIT) || PAGINATION_LIMIT;
    const search = req.query.search || null;

    const skip = (page - 1) * pageSize;

    const query = {
      userId: decodedToken?.user_id,
      isDeleted: 0,
    };

    let list = [];
    let totalCount = 0;
    if (search !== null) {
      let allData = await TerminplanungLeistungSchema.find(query).select(
        '-__v'
      );
      const regex = new RegExp(search, 'i');

      list = allData.filter((item) => regex.test(item.Leistung));
      totalCount = list?.length;
      list = list.slice(skip, skip + pageSize);
    } else {
      list = await TerminplanungLeistungSchema.find(query)
        .select('-__v')
        .skip(skip)
        .limit(pageSize);
      totalCount = await TerminplanungLeistungSchema.countDocuments(query);
    }

    let response = {
      status_code: 200,
      message: 'Daten gefunden.',
      data: { list, totalCount, page, pageSize },
    };
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const saveTerminplanung = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const leistungObjectSchema = Joi.object({
      Leistung: Joi.string().required(),
      Dauer: Joi.string().required(),
      Kosten: Joi.number().required(),
      Beschreibung: Joi.string().required(),
      Umsatzsteuerwahl: Joi.string().required(),
    });

    const { error } = leistungObjectSchema.validate(req.body);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const decodedToken = jwt.verify(
      req.headers['x-access-token'],
      process.env.TOKEN_KEY
    );

    const leistung = new TerminplanungLeistungSchema({
      userId: decodedToken?.user_id,
      Leistung: requestBody?.Leistung,
      Dauer: requestBody?.Dauer,
      Kosten: requestBody?.Kosten,
      Beschreibung: requestBody?.Beschreibung,
      Umsatzsteuerwahl: requestBody?.Umsatzsteuerwahl,
    });
    await leistung.save();

    if (leistung) {
      let response = {
        status_code: 200,
        message: 'Leistung hinzugefügt',
        data: leistung,
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

const getTerminplanungById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leistungSchema = Joi.object({
      id: Joi.string().required(),
    });

    const { error } = leistungSchema.validate(req.params);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const leistung = await TerminplanungLeistungSchema.findOne({
      _id: id,
      isDeleted: 0,
    }).select(' -__v -isDeleted');

    if (leistung) {
      let response = {
        status_code: 200,
        message: 'Leistung Aktualisiert',
        data: leistung,
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Leistung nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const updateTerminplanung = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const leistungObjectSchema = Joi.object({
      id: Joi.string().required(),
      Leistung: Joi.string().required(),
      Dauer: Joi.string().required(),
      Kosten: Joi.number().required(),
      Beschreibung: Joi.string().required(),
      Umsatzsteuerwahl: Joi.string().required(),
    });

    const { error } = leistungObjectSchema.validate(req.body);
    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const updateTerminplanungLeistung =
      await TerminplanungLeistungSchema?.findOne({
        _id: requestBody?.id,
        isDeleted: 0,
      });

    if (updateTerminplanungLeistung) {
      updateTerminplanungLeistung.Leistung = requestBody?.Leistung;
      updateTerminplanungLeistung.Dauer = requestBody?.Dauer;
      updateTerminplanungLeistung.Kosten = requestBody?.Kosten;
      updateTerminplanungLeistung.Beschreibung = requestBody?.Beschreibung;
      updateTerminplanungLeistung.Umsatzsteuerwahl =
        requestBody?.Umsatzsteuerwahl;
      if (updateTerminplanungLeistung.save()) {
        let response = {
          status_code: 200,
          message: 'Leistung Aktualisiert',
        };
        return res.status(200).send(response);
      }
    } else {
      let response = {
        status_code: 400,
        message: 'Leistung nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

const terminplanungRemove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const leistungObjectSchema = Joi.object({
      id: Joi.string().required(),
    });

    const { error } = leistungObjectSchema.validate(req.params);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const decodedToken = jwt.verify(
      req.headers['x-access-token'],
      process.env.TOKEN_KEY
    );

    const terminplanungLeistung = await TerminplanungLeistungSchema.findOne({
      _id: id,
      isDeleted: 0,
    });
    const decodedObjectId = new ObjectId(decodedToken?.user_id);

    if (
      terminplanungLeistung &&
      (terminplanungLeistung?.userId.equals(decodedObjectId) ||
        decodedToken?.isAdmin === 1)
    ) {
      terminplanungLeistung.isDeleted = 1;
      terminplanungLeistung.deletedAt = new Date();
      terminplanungLeistung.save();
      let response = {
        status_code: 200,
        message: 'Leistung Aktualisiert',
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Leistung nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

/* Global Point */
const getGlobalPointValue = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

    const checkExist = await GlobalPointsSchema.findOne({
      userId: decodedToken?.user_id,
    });

    let response = {
      status_code: 200,
      message: 'Leistung Aktualisiert',
      data: checkExist?.value ? checkExist?.value : GLOBAL_POINT_VALUE,
    };
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const updateGlobalPointValue = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const globalPointsSchema = Joi.object({
      value: Joi.number().required(),
    });

    const { error } = globalPointsSchema.validate(req.body);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const token = req.headers['x-access-token'];
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const checkExist = await GlobalPointsSchema.findOne({
      userId: decodedToken?.user_id,
    });
    if (checkExist) {
      checkExist.value = requestBody?.value;
      await checkExist.save();
    } else {
      const globalPoint = new GlobalPointsSchema({
        userId: decodedToken?.user_id,
        value: requestBody?.value,
      });
      await globalPoint.save();
    }
    let response = {
      status_code: 200,
      message: 'Leistung Aktualisiert',
    };
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAbrechnung,
  saveAbrechnung,
  getAbrechnungById,
  updateAbrechnung,
  abrechnungRemove,
  getAllTerminplanung,
  saveTerminplanung,
  getTerminplanungById,
  updateTerminplanung,
  terminplanungRemove,
  getGlobalPointValue,
  updateGlobalPointValue,
};
