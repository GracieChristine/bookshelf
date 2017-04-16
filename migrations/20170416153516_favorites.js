"use strict"

exports.up = (knex) => {
  return knex.schema.createTable("favorites", (table) => {
    table.increments();
    table.integer("book_id")
      .notNullable()
      .references("books.id")
      .onDelete("CASCADE");
    table.integer("user_id")
      .notNullable()
      .references("users.id")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  })
};

exports.down = (knex) => {
  return knex.schema.dropTable("favorites")
};
