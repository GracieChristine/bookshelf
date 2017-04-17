"use strict";

let express = require("express");
let router = express.Router();
let knex = require("../knex");
let {
      camelizeKeys,
      decamelizeKeys
    } = require("humps");
let boom = require("boom");
let ev = require("express-validation");
let validations = require("../validations/books");

//  GET /books
router.get("/", (req, res, next) => {
  knex("books")
    .orderBy("title", "asc")
    .then((books) => {
      res.send(camelizeKeys(books));
    })
    .catch((error) => {
      next(error);
    });
});

//  GET /books/:id
router.get("/:id", (req, res, next) => {
  let id = req.params.id;

  // //  GET /books/9000 & GET /books/-1
  // if (!id) {
  //   return next(boom.create(404, "Not Found"));
  // }
  //
  // //  GET /books/one
  // else if (typeof id !== "number") {
  //   return next(boom.create(404, "Not Found"));
  // }
  // else {
    return knex("books")
      .where("id", id)
      .then((books) => {
        // res.set("Content-Type", "application/json")
        res.send(camelizeKeys(books[0]));
      })
      .catch((error) => {
        next(error);
      });
  // }
});

//  POST /books
router.post("/", ev(validations.post), (req, res, next) => {
  let addBook = req.body

  //  POST /books without title
  if (addBook.title === undefined) {
    return next(boom.create(400, "Title must not be blank"));
  }

  //  POST /books without author
  else if (addBook.author === undefined) {
    return next(boom.create(400, "Author must not be blank"));
  }

  //  POST /books without genre
  else if (addBook.genre === undefined) {
    return next(boom.create(400, "Genre must not be blank"));
  }

  //  POST /books without description
  else if (addBook.description === undefined) {
    return next(boom.create(400, "Description must not be blank"));
  }

  //  POST /books without coverUrl
  else if (addBook.coverUrl === undefined) {
    return next(boom.create(400, "Cover URL must not be blank"));
  }
  else {
    return knex("books")
      .returning(["id", "title", "author", "genre", "description", "cover_url"])
      .insert({
        title: addBook.title,
        author: addBook.author,
        genre: addBook.genre,
        description: addBook.description,
        cover_url: addBook.coverUrl
      })
      .then((books) => {
        res.send(camelizeKeys(books[0]));
      })
      .catch((error) => {
        next(error);
      });
  }
});

//  PATCH /books/:id
router.patch("/:id", (req, res, next) => {
  let id = req.params.id;
  let updateBook = req.body;

  // //  PATCH /books/9000 &  PATCH /books/-1
  // if (id !== "id") {
  //   return next(boom.create(404, "Not Found"));
  // }
  //
  // //  PATCH /books/one
  // else if (typeof id !== "number") {
  //   return next(boom.create(404, "Not Found"));
  // }
  // else {
    return knex("books")
      .returning(["id", "title", "author", "genre", "description", "cover_url"])
      .where("id", id)
      .update({
        title: updateBook.title,
        author: updateBook.author,
        genre: updateBook.genre,
        description: updateBook.description,
        cover_url: updateBook.coverUrl
      })
      .then((books) => {
        // res.set("Content-Type", "application/json")
        res.send(camelizeKeys(books[0]));
      })
      .catch((error) => {
        next(error);
      });
  // }
});

//  DELETE /books/:id
router.delete("/:id", (req, res, next) => {
  let id = req.params.id

  // //  DELETE /books/9000 &  DELETE /books/-1
  // if (id !== "id") {
  //   return next(boom.create(404, "Not Found"));
  // }
  //
  // //  DELETE /books/one
  // else if (typeof id !== "number") {
  //   return next(boom.create(404, "Not Found"));
  // }
  // else {
    return knex("books")
      .returning(["title", "author", "genre", "description", "cover_url"])
      .where("id", id)
      .del()
      .then((books) => {
        // res.set("Content-Type", "application/json")
        res.send(camelizeKeys(books[0]));
      })
      .catch((error) => {
        next(error);
      });
  // }
});

module.exports = router;
