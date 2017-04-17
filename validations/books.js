"use strict";

let Joi = require("joi")

module.exports.post = {
  body: {
    title: Joi.string()
      .label("Title")
      .required()
      .max(255),
    author: Joi.string()
      .label("Author")
      .required()
      .min(1)
      .max(255),
    genre: Joi.string()
      .label("Genre")
      .required()
      .min(1)
      .max(25),
    description: Joi.string()
      .label("Description")
      .required()
      .min(5)
      .max(1000),
    coverUrl: Joi.string()
      .label("Cover URL")
      .required()
      .max(255)
  }
};
