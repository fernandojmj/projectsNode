"use strict";
const User = use("App/Models/user");

class SessionController {
  async store({ request, response, auth }) {
    console.log("entrou no login");
    // try {
    const { email, password } = request.all();
    const token = await auth.attempt(email, password);
    let users = null;
    let user = null;
    let returnToken = null;
    console.log("Token :" + token);
    if (token != null) {
      console.log("consutando usuario :" + email);
      let query = User.query();
      query = query.where("email", email);
      users = await query.fetch();
      user = users.toJSON()[0];
      console.log(user);
      user.password = "";
      returnToken = token.toJSON();
    }
    return { returnToken, user };
    // } catch (err) {
    return response.status(err.status).send({
      error: {
        erro: "Login inválido"
      }
    });
    // }
  }
}

module.exports = SessionController;
