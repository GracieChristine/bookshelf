"use strict";

let express = require("express");
let router = express.Router();
let knex = require("../knex");
let {
      camelizeKeys,
      decamelizeKeys
    } = require("humps");
let bcrypt = require("bcrypt");
let boom = require("boom");

//  POST USER
router.post("/", (req, res, next) => {
  let newUser = req.body;

  knex("users")
    .returning(["id", "first_name", "last_name", "email"])
    .insert({
      first_name: newUser.firstName,
      last_name: newUser.lastName,
      email: newUser.email,
      hashed_password: bcrypt.hashSync(newUser.password, 10)
    })
    .then((users) => {
      res.send(camelizeKeys(users[0]))
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
