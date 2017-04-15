"use strict";

module.exports = {
  development: {
    client: "pg",
    connection: "postgres://localhost/myBookshelf_dev"
  },
  test: {
    client: "pg",
    connection: "postgres://localhost/myBookshelf_test"
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL + "?ssl=true"
  }
};
