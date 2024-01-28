const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { BegruendungstexteSchema } = require('../models/begruendungstexteModel');
const { PAGINATION_LIMIT } = require('../utils/constants');
const { UserSchema } = require('../models/userModel');

const getAll = async (req, res, next) => {
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
      let allData = await BegruendungstexteSchema.find(query).select('-__v');
      const regex = new RegExp(search, 'i');

      list = allData.filter((item) => regex.test(item.begruendungstexte));
      totalCount = list?.length;
      list = list.slice(skip, skip + pageSize);
    } else {
      list = await BegruendungstexteSchema.find(query)
        .select('-__v')
        .skip(skip)
        .limit(pageSize);
      totalCount = await BegruendungstexteSchema.countDocuments(query);
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

const save = async (req, res, next) => {
  try {
    const requestBody = req.body;
    const begruendungstexteObjectSchema = Joi.object({
      // id: Joi.string().required(),
      begruendungstexte: Joi.string().required(),
    });

    // Define the schema for the entire array
    const begruendungstexteArraySchema = Joi.array().items(
      begruendungstexteObjectSchema
    );

    const { error } = begruendungstexteArraySchema.validate(req.body);

    if (error) {
      let response = {
        status_code: 400,
        message: error.details.map((detail) => detail.message),
      };
      return res.status(400).send(response);
    }

    const decodedToken = jwt.verify(
      req.headers['x-access-token'],
      process.env.TOKEN_KEY
    );

    const userData = await UserSchema.findById(decodedToken?.user_id);
    const addData = await Promise.all(
      requestBody?.map(async (item) => {
        const begruendungstexte = new BegruendungstexteSchema({
          userId: decodedToken?.user_id,
          userChiffre: userData?.Chiffre,
          begruendungstexte: item?.begruendungstexte,
        });
        return begruendungstexte.save();
      })
    );

    if (addData) {
      let response = {
        status_code: 200,
        message: 'Begründung hinzugefügt',
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

const update = async (req, res, next) => {
  try {
    const requestBody = req.body;

    const begruendungstexteObjectSchema = Joi.object({
      id: Joi.string().required(),
      begruendungstexte: Joi.string().required(),
    });

    // Define the schema for the entire array
    const begruendungstexteArraySchema = Joi.array().items(
      begruendungstexteObjectSchema
    );

    const { error } = begruendungstexteArraySchema.validate(req.body);

    if (error) {
      let response = {
        status_code: 400,
        message: error.details.map((detail) => detail.message),
      };
      return res.status(400).send(response);
    }

    const decodedToken = jwt.verify(
      req.headers['x-access-token'],
      process.env.TOKEN_KEY
    );

    await Promise.all(
      requestBody?.map(async (item) => {
        const begruendungstexte = await BegruendungstexteSchema.findOne({
          _id: item?.id,
          isDeleted: 0,
        });
        const decodedObjectId = new ObjectId(decodedToken?.user_id);
        if (
          begruendungstexte &&
          (begruendungstexte?.userId.equals(decodedObjectId) ||
            decodedToken?.isAdmin === 1)
        ) {
          begruendungstexte.begruendungstexte = item?.begruendungstexte;
          begruendungstexte.save();
        }
      })
    );

    let response = {
      status_code: 200,
      message: 'Begründung Aktualisiert',
    };
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const begruendungstexteSchema = Joi.object({
      id: Joi.string().required(),
    });

    const { error } = begruendungstexteSchema.validate(req.params);

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

    const begruendungstexte = await BegruendungstexteSchema.findOne({
      _id: id,
      isDeleted: 0,
    });
    const decodedObjectId = new ObjectId(decodedToken?.user_id);

    if (
      begruendungstexte &&
      (begruendungstexte?.userId.equals(decodedObjectId) ||
        decodedToken?.isAdmin === 1)
    ) {
      begruendungstexte.isDeleted = 1;
      begruendungstexte.deletedAt = new Date();
      begruendungstexte.save();
      let response = {
        status_code: 200,
        message: 'Begründung Aktualisiert',
      };
      return res.status(200).send(response);
    } else {
      let response = {
        status_code: 400,
        message: 'Begründung nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, save, update, remove };
