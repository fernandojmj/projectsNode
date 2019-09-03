"use strict";

const Antl = use("Antl");
class user {
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      // validation rules
      password_old: "required",
      password: "required|confirmed"
    };
  }
  get messages() {
    return Antl.list("validation");
  }
}

module.exports = user;
