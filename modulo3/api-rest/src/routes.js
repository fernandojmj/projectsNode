const express = require('express')
const expressValidator = require('express-validation')
const handle = require('express-async-handler')
const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')
const authMiddlaware = require('./app/middlewares/auth')
const AdController = require('./app/controllers/AdController')
const PurcharseController = require('./app/controllers/purchaseController')
const validators = require('./app/validations')

const routes = express.Router()

routes.post(
  '/users',
  expressValidator(validators.User),
  handle(UserController.store)
)
routes.post(
  '/sessions',
  expressValidator(validators.Session),
  handle(SessionController.store)
)

// ads
routes.get('/showAll', authMiddlaware, AdController.findall)
routes.get('/show/:id', handle(AdController.show))
routes.put('/edit/:id', handle(AdController.update))
routes.delete('/delete/:id', handle(AdController.delete))
routes.post(
  '/create',
  expressValidator(validators.Ad),
  authMiddlaware,
  handle(AdController.create)
)

// purchase
routes.post(
  '/purchase',
  expressValidator(validators.Purchase),
  authMiddlaware,
  handle(PurcharseController.store)
)

// vendor
routes.get('/accept/:id', authMiddlaware, handle(AdController.vendor))
module.exports = routes
