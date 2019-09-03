"use strict";

const Antl = use("Antl");
class user {
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      // validation rules
      email: "required|email|unique:users",
      password: "required",
      username: "required"
    };
  }
  get messages() {
    return Antl.list("validation");
  }
}

module.exports = user;
