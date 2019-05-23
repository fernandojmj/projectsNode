const { Appointment, User } = require('../models')
const { Op } = require('sequelize')
const moment = require('moment')

class AppointmentController {
  async index (req, res) {
    return res.render('appointments/myAppointments')
  }
  async create (req, res) {
    const provider = await User.findByPk(req.params.provider)
    console.log({ provider })
    return res.render('appointments/create', { provider })
  }

  async store (req, res) {
    const { id } = req.session.user
    const { provider } = req.params
    const { date } = req.body

    await Appointment.create({
      user_id: id,
      provider_id: provider,
      date
    })
    res.redirect('/app/dashboard')
  }

  async myAppointmets (req, res) {
    const date = moment(parseInt(req.query.date))
    const appointments = await Appointment.findAll({
      include: [{ model: User, as: 'user' }],
      where: {
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            date.startOf('day').format(),
            date.endOf('day').format()
          ]
        }
      }
    })

    console.log(appointments)

    return res.render('appointments/appointmetsProvider', { appointments })
  }
}

module.exports = new AppointmentController()
