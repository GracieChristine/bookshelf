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

  if (!newUser.email || newUser.email.trim() === "") {
    return next(boom.create(400, "Email must not be blank"));
  }
  else if (!newUser.password || newUser.password.trim() === "") {
    return next(boom.create(400, "Password must be at least 8 characters long"));
  }
  else {
    knex("users")
      .where("email", newUser.email)
      .then((existUser) => {
        if (existUser.length > 0) {
          return next(boom.create(400, "Email already exists"))
        }
        else {
          knex("users")
          .returning(["id", "first_name", "last_name", "email"])
          .insert({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            hashed_password: bcrypt.hashSync(req.body.password, 8)
          })
          .then((users) => {
            res.send(camelizeKeys(users[0]))
          })
          .catch((error) => {
            next(error)
          });
        }
      });
  }
});

module.exports = router;
