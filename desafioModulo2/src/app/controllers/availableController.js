const Moment = require('moment')
const { Appointment } = require('../models')
const { Op } = require('sequelize')

class AvailableController {
  async index (req, res) {
    const date = Moment(parseInt(req.query.date))

    const Appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.provider,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    const schedule = ['01:00', '10:00', '11:00', '12:00', '13:00']

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':')
      const value = date
        .hour(hour)
        .minute(minute)
        .second(0)

      return {
        time,
        value: value.format(),
        available:
          value.isAfter(Moment()) &&
          !Appointments.find(a => Moment(a.date).format('HH:mm') === time)
      }
    })
    console.log(Appointments)
    return res.render('available/index', { available })
  }
}

module.exports = new AvailableController()
