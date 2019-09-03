"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Meetapp extends Model {
  static boot() {
    super.boot();
  }

  user() {
    return this.belongsTo("App/Models/User");
  }

  inscricoes() {
    return this.belongsToMany("App/Models/Inscricao");
  }
}

module.exports = Meetapp;
