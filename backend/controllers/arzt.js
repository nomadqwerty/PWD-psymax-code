const { ArztSchema } = require('../models/arztModel');

const getAll = async (req, res, next) => {
  try {
    const data = await ArztSchema.find({
      isDeleted: 0,
    }).select('-__v -isDeleted');

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
        message: 'Daten nicht gefunden',
      };
      return res.status(400).send(response);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll };
