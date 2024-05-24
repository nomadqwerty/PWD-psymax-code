const Joi = require('joi');
const { UserSchema } = require('../models/userModel');

/**
 * @type {import('express').Handler}
 */
const extendTrialPhase = async (req, res, next) => {
  try {
    const isAdmin = req.user.isAdmin;
    const userId = req.params.id;
    // If requester is not admin, deny permission
    if (isAdmin !== 1) {
      let response = {
        status_code: 401,
        message: "You can't perform this action",
      };
      return res.status(401).send(response);
    }

    const userSchema = Joi.object({
      trialEnd: Joi.date(),
    });

    const { error } = userSchema.validate(req.body);

    if (error) {
      let response = {
        status_code: 400,
        message: error?.details[0]?.message,
      };
      return res.status(400).send(response);
    }

    const requestBody = req.body;

    const updateResult = await UserSchema.findByIdAndUpdate(userId, {
      trialEnd: requestBody?.trialEnd,
    });

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

module.exports = { extendTrialPhase };
