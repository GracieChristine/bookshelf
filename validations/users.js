"use strict";

let Joi = require("joi");

module.exports.post = {
  body: {
    firstName: Joi.string()
      .label("First Name")
      .required()
      .trim()
      .min(3)
      .max(12),
    lastName: Joi.string()
      .label("Last Name")
      .required()
      .trim()
      .min(3)
      .max(12),
    email: Joi.string()
      .label("Email")
      .required()
      .trim()
      .email(),
    password: Joi.string()
      .label("Password")
      .required()
      .strip()
      .trim()
      .min(8)
      .max(25)
  }
};
