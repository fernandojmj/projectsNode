const express = require('express')

const routes = express.Router()

const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')

const multerConfig = require('./config/multer')
const upload = require('multer')(multerConfig)
const authMiddleware = require('./app/middlewares/auth')
const gestMiddleware = require('./app/middlewares/middleGest')
const dashboardController = require('./app/controllers/DashboardController')
const fileController = require('./app/controllers/FileController')
const AppointmentController = require('./app/controllers/AppointmentController')
const AvailableController = require('./app/controllers/availableController')

routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success')
  res.locals.flashError = req.flash('error')

  return next()
})

routes.use('/app', authMiddleware)

routes.get('/files/:file', fileController.show)
routes.get('/', gestMiddleware, SessionController.create)
routes.get('/signup', gestMiddleware, UserController.create)
routes.post('/signup', upload.single('avatar'), UserController.store)

routes.post('/signin', SessionController.store)
routes.get('/logout', SessionController.destroy)
routes.get('/app/dashboard', dashboardController.index)
routes.get('/app/appointments/new/:provider', AppointmentController.create)
routes.post('/app/appointments/new/:provider', AppointmentController.store)
routes.get('/app/available/:provider', AvailableController.index)

routes.get('/app/myAppointments', AppointmentController.myAppointmets)
routes.get('/app/appointmentsProvider', AppointmentController.index)
module.exports = routes
