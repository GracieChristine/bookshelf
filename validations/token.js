"use strict";

let Joi = require("joi");

module.exports.post = {
  body: {
    email: Joi.string()
      .label("Email")
      .required()
      .email()
      .trim(),
    password: Joi.string()
      .label("Password")
      .required()
      .strip()
      .trim()
      .min(8)
      .max(255)
  }
};
