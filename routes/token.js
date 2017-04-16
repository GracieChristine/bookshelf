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
let jwt = require("jsonwebtoken");
let cookie = require("cookie-session");

//  GET
router.get("/", (req, res, next) => {
  if (!req.cookies.token) {
    //  GET /token without token
    res.status(200).send(false);
  }
  else {
    //  GET /token with token
    res.status(200).send(true);
  }
});

//  POST
router.post("/", (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;

  //  POST /token with no email
  if (!email || email.trim() === "") {
    return next(boom.create(400, "Email must not be blank"));
  }

  //  POST /token with no password
  if (!password || password.trim() === "") {
    return next(boom.create(400, "Password must not be blank"));
  }

  knex("users")
    .where("email", email)
    .then((users) => {
      if (users.length > 0) {
        //  POST /token
        bcrypt.compare(password, users[0].hashed_password, (err, boolean) => {
          if (boolean) {
            let token = jwt.sign({
              email: users[0].email,
              password: users[0].hashed_password
            }, "shhh");

            res.cookie("token", token, {
              httpOnly: true
            });
            delete users[0].hashed_password
            res.send(camelizeKeys(users[0]))
          }
          else {
            //  POST /token with bad password
            next(boom.create(400, "Bad email or password"))
          }
        })
      }
      else {
        //  POST /token with bad email
        next(boom.create(400, "Bad email or password"))
      }
    })
})

//  DELETE
router.delete("/", (req, res, session) => {
  //  DELETE /token
  res.clearCookie("token");
  res.send(true);
});


module.exports = router;
