"use strict";

const User = use("App/Models/user");
const hash = use("Hash");

class UserController {
  async store({ request }) {
    const data = request.only(["username", "email", "password"]);
    // try {
    const user = User.create(data);
    // } catch (error) {
    //   console.log(error.Error.sqlMessage);
    //   return response.status(401).send({
    //     error: {
    //       erro: error.Error.sqlMessage
    //     }
    //   });
    // }

    return user;
  }

  async update({ request, response, auth: { user } }) {
    const data = request.only([
      "password_old",
      "password",
      "confirmPassword",
      "username",
      "email"
    ]);

    if (data.password_old !== "") {
      console.log(user.password);
      console.log(data.password_old);
      console.log(data.confirmPassword);

      if (data.confirmPassword !== data.password) {
        return response.status(401).send({
          error: {
            erro: "Digite a mesma senha no campo de confirmação!!!"
          }
        });
      }

      const isPassWord = await hash.verify(data.password_old, user.password);
      console.log(isPassWord);
      if (!isPassWord) {
        return response.status(401).send({
          error: {
            erro: "Dados não conferem!!!"
          }
        });
      }

      if (!data.password) {
        return response.status(401).send({
          error: {
            erro: "Favor informar uma nova senha!!!"
          }
        });
      }

      delete data.password_old;
      delete data.confirmPassword;

      console.log(data);

      user.merge(data);

      await user.save();

      return user;
    } else {
      if (data.username) {
        console.log(user);
        user.merge(data);

        await user.save();

        return user;
      } else {
        return response.status(401).send({
          error: {
            erro: "Favor informar a sua senha antiga!!!"
          }
        });
      }
    }
  }
}

module.exports = UserController;
