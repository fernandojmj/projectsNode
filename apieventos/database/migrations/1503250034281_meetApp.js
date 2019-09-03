"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MeetAppSchema extends Schema {
  up() {
    this.create("meetapps", table => {
      table.increments();
      table.string("nome", 254).notNullable();
      table.string("descricao", 10000).notNullable();
      table.timestamp("data");
      table.string("local", 60).notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users");
      table.timestamps();
    });
  }

  down() {
    this.drop("meetapps");
  }
}

module.exports = MeetAppSchema;
