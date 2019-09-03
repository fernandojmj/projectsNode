"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class InscricaoSchema extends Schema {
  up() {
    this.create("inscricaos", table => {
      table.increments();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users");
      table
        .integer("meetapp_id")
        .unsigned()
        .references("id")
        .inTable("meetapps");
      table.timestamps();
    });
  }

  down() {
    this.drop("inscricaos");
  }
}

module.exports = InscricaoSchema;
