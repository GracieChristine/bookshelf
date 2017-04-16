"use strict"

exports.up = (knex) => {
  return knex.schema.createTable("users", (table) => {
    // CREATING SERIAL PRIMARY KEY
    table.increments();
    table.string("first_name", 255).notNullable().defaultTo("");
    table.string("last_name", 255).notNullable().defaultTo("");
    table.string("email", 255).notNullable().unique();
    table.specificType("hashed_password", "character(60)").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("users");
};
