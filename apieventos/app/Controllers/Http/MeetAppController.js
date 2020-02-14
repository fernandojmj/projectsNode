"use strict";

const MeetApp = use("App/Models/Meetapp");
const moment = require("moment");
const Database = use("Database");

class MeetAppController {
  async showAll({ params, request, response, auth }) {
    // const meets = MeetApp.findByOrFail("user_id", auth.user.id);

    let query = MeetApp.query().with("user");
    query = query.where(`user_id`, auth.user.id);

    const meets = await query.fetch();

    // const meets = await Database.from("meet_apps")
    //   .where("user_id", auth.user.id)
    //   .paginate(1, 20);

    return meets;
  }

  async store({ request, response, auth }) {
    let meetApp = request.only(["nome", "local", "descricao"]);
    const data = request.only(["dataMeet"]);
    try {
      //String is already in utc time, but still need to put it into utc mode
      var active_time = moment.utc(
        data.dataMeet,
        // "2019-08-25T23:00Z"
        "YYYY-MM-DD[T]HH:mm:ss[Z]"
        // "YYYY-MM-DDHH:mm"
      );

      meetApp.data = moment(data.dataMeet, "YYYY-MM-DD[T]HH:mm:ss[Z]").format(
        "YYYY-MM-DD HH:mm:ss"
      );
      console.log(meetApp);
      //Convert current time to moment object with utc time
      var current_time = moment();
      console.log("active_time =", active_time.format());
      console.log("current_time =", current_time.format());
      console.log(active_time.isAfter(current_time));
      const passed = active_time.isAfter(current_time);
      console.log(passed);
      if (passed) {
        const evento = MeetApp.create({ ...meetApp, user_id: auth.user.id });
        return evento;
      } else {
        return response.status(500).send({
          error: {
            message: "Não é possivel cadastrar evento em data passada"
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

module.exports = MeetAppController;
