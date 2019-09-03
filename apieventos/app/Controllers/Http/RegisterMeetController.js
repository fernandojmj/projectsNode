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

    // try {

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

    // console.log(meetAppUsers.rows);

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
      console.log(dateRegisterbase.format());
      console.log(dateRegister.format());
      console.log("=============================");

      if (dateRegister.format() === dateRegisterbase.format()) {
        return response.status(401).send({
          error: {
            message: "Você já possui um evendo nesta data e horário."
          }
        });
      }
    }
    // return meet.data;
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
    // } catch (error) {
    //   return response.status(500).send({
    //     error: {
    //       message: "Ocorreu um erro ao tentar cadastrar um Evento"
    //     }
    //   });
  }

  async update({ params, request, response, auth }) {
    const meet = await MeetApp.findOrFail(params.id);

    //Usuario só pode editar evento o qual ele criou
    if (meet.user_id !== auth.user.id) {
      return response.status(401).send({
        errot: {
          message: "Você não esta autorizado a editar esse Evento!"
        }
      });
    }

    if (moment().isAfter(meet.data)) {
      return response.status(401).send({
        errot: {
          message: "Evento ja passou não pode ser editado!"
        }
      });
    }

    const meetApp = request.only(["nome", "local", "descricao", "data"]);

    var date_edit = moment.utc(
      meetApp.data,
      // "2019-08-25T23:00Z",
      "YYYY-MM-DD[T]HH:mm[Z]"
    );

    if (moment().isAfter(date_edit)) {
      return response.status(401).send({
        errot: {
          message: "Data escolhida já passou!"
        }
      });
    }

    meet.merge(meetApp);
    await meet.save();

    return meet;
  }

  async destroy({ params, request, response, auth }) {
    const meet = await MeetApp.findOrFail(params.id);

    //Usuario só pode editar evento a qual ele criou
    if (meet.user_id !== auth.user.id) {
      return response.status(401).send({
        errot: {
          message: "Você não esta autorizado a apagar esse Evento!"
        }
      });
    }

    if (moment().isAfter(meet.data)) {
      return response.status(401).send({
        errot: {
          message: "Evento já passou não pode ser apagado!"
        }
      });
    }

    meet.delete();

    return response.status(200).send({
      status: {
        message: "evento apagado com sucesso!"
      }
    });
  }
}

module.exports = RegisterMeetController;
