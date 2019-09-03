"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Inscricao extends Model {
  static boot() {
    super.boot();
  }

  user() {
    return this.belongsTo("App/Models/User");
  }

  meetApp() {
    return this.belongsTo("App/Models/MeetApp");
  }
}

module.exports = Inscricao;
