"use strict";

const RegisterMeet = use("App/Models/Inscricao");
const MeetApp = use("App/Models/Meetapp");
const moment = require("moment");
const Database = use("Database");

class RegisterMeetController {
  async showAll({ params, request, response, auth }) {
    // const meets = RegisterMeet.findByOrFail("user_id", auth.user.id);

    let query = RegisterMeet.query().with("user");
    query = query.where(`id_user`, auth.user.id);

    const meets = await query.fetch();

    // const meets = await Database.from("meet_apps")
    //   .where("user_id", auth.user.id)
    //   .paginate(1, 20);

    return meets;
  }

  async store({ request, response, auth }) {
    const { meet_id } = request.only(["meet_id"]);

    try {
      console.log(meet_id);
      const meet = await MeetApp.findOrFail(meet_id);

      // console.log(meet);

      if (meet.user_id === auth.user.id) {
        return response.status(401).send({
          errot: {
            message:
              "Você é o criador deste evento e não pode se inscrever no mesmo"
          }
        });
      }

      let query = RegisterMeet.query();
      query = query.where({
        user_id: auth.user.id || 0,
        meetapp_id: meet_id || 0
      });

      const meetAppUsers = await query.fetch();

      if (meetAppUsers.rows.length > 0) {
        return response.status(401).send({
          error: {
            message: "Você já esta inscrito neste evento"
          }
        });
      }

      let queryRegisters = RegisterMeet.query()
        .with("meetApp")
        .where({
          user_id: auth.user.id || 0
        });

      const registers = await queryRegisters.fetch();

      const obj = registers.toJSON();
      // console.log(obj[0].meetApp);

      var dateRegister = moment.utc(meet.data, "YYYY-MM-DD[T]hh:mm");
      for (var i = 0; i < obj.length; i++) {
        var dateRegisterbase = moment.utc(
          obj[i].meetApp.data,
          "YYYY-MM-DD[T]hh:mm",
          "br"
        );

        if (dateRegister.format() === dateRegisterbase.format()) {
          return response.status(401).send({
            error: {
              message:
                "Você já esta inscrito em um evento nesta data e horário."
            }
          });
        }
      }

      var current_time = moment();
      const passed = current_time.isAfter(meet.data);

      if (!passed) {
        const register = RegisterMeet.create({
          user_id: auth.user.id,
          meetapp_id: meet.id
        });
        return register;
      } else {
        return response.status(401).send({
          error: {
            message: "Evento já finalizado."
          }
        });
      }
    } catch (error) {
      return response.status(500).send({
        error: {
          message: "Ocorreu um erro ao tentar cadastrar um Evento"
        }
      });
    }
  }
}

module.exports = RegisterMeetController;
