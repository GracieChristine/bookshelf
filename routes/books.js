"use strict";

let express = require("express");
let router = express.Router();
let knex = require("../knex");
let {
      camelizeKeys,
      decamelizeKeys
    } = require('humps');
let boom = require("boom");

//  GET BOOKS
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

router.get("/:id", (req, res, next) => {
  let id = req.params.id;

  knex("books")
    .where("id", id)
    .then((books) => {
      res.send(camelizeKeys(books[0]));
    })
    .catch((error) => {
      next(error);
    });
});

//  POST BOOKS
router.post("/", (req, res, next) => {
  let addBook = req.body

  knex("books")
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
});

//  UPDATE BOOKS
router.patch("/:id", (req, res, next) => {
  let id = req.params.id;
  let updateBook = req.body;

  knex("books")
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
});

//  DELETE BOOKS
router.delete("/:id", (req, res, next) => {
  let id = req.params.id

  knex("books")
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
});

module.exports = router;
