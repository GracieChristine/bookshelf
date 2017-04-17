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
// let ev = require("express-validation");
// let validations = require("../validations/favorites");

//  GET
router.get("/", (req, res, next) => {
  //  GET /favorites without token
  if (!req.cookies.token) {
    return next(boom.create(401, "Unauthorized"));
  }

  //  GET /favorites with token
  else {
    knex("books")
      .innerJoin("favorites", "books.id", "favorites.book_id")
      .select("favorites.id", "favorites.book_id", "favorites.user_id", "books.title", "books.author", "books.genre", "books.description", "books.cover_url", "books.created_at", "books.updated_at")
      .then((favorites) => {
        res.send(camelizeKeys(favorites));
      })
      .catch((error) => {
        next(error);
      });
  }
});

router.get("/check", (req, res, next) => {
  //  GET /favorites/check?bookId=1 & GET /favorites/check?bookId=2 without token
  if (!req.cookies.token) {
    return next(boom.create(401, "Unauthorized"));
  }
  //
  // //  GET /favorites/check?bookId=one
  // if (typeof req.query.bookId !== "number") {
  //   return next(boom.create(400, "Book ID must be an integer"));
  // }

  //  GET /favorites/check?bookId=1 & GET /favorites/check?bookId=2 with token
  else {
    knex("favorites")
      .where({
        book_id: req.query.bookId
      })
      .then((data) => {
        if (data.length > 0) {
          res.send(true);
        }
        else {
          res.send(false);
        }
      })
      .catch((error) => {
        next(error);
      });
  }
});

//  POST
router.post("/", (req, res, next) => {
  //  POST /favorites without token
  if (!req.cookies.token) {
    next(boom.create(401, "Unauthorized"));
  }

  // //  POST /favorites with non-integer bookId
  // if (typeof req.body.bookId !== "number") {
  //   return next(boom.create(400, "Book ID must be an integer"));
  // }
  //
  // //  POST /favorites with unknown bookId
  // if (req.body.bookId !== req.params.bookId) {
  //   return next(boom.create(404, "Book not found"));
  // }

  //  POST /favorites with token
  else {
    knex("favorites")
      .returning(["id", "book_id", "user_id"])
      .insert({
        book_id: req.body.bookId,
        user_id: 1
      })
      .then((newFavorites) => {
        res.send(camelizeKeys(newFavorites[0]));
      })
      .catch((error) => {
        next(error);
      })
  }
})

//  DELETE
router.delete("/", (req, res, next) => {
  let book;

  //  DELETE /favorites without token
  if (!req.cookies.token) {
    return next(boom.create(401, "Unauthorized"));
  }

  // //  DELETE /favorites with non-integer bookId
  // if (typeof req.body.bookId !== "number") {
  //   return next(boom.create(400, "Book ID must be an integer"));
  // }
  //
  // //  DELETE /favorites with unknown favorite
  // if (req.body.bookId !== req.params.bookId) {
  //   return next(boom.create(404, "Favorite not found"));
  // }

  //  DELETE /favorites with token
  else {
    knex("favorites")
      .where("book_id", req.body.bookId)
      .first()
      .then((notfavorite) => {
        if (!notfavorite) {
          return next();
        }
        book = camelizeKeys(notfavorite);

        return knex("favorites")
          .del()
          .where("id", req.body.bookId);
      })
      .then(() => {
        delete book.id;
        res.send(book);
      })
      .catch((error) => {
        next(error);
      });
  }
});

module.exports = router;
