const express = require('express')
const UserController = require('./app/controllers/UserController')
const SessionController = require('./app/controllers/SessionController')
const authMiddlaware = require('./app/middlewares/auth')
const AdController = require('./app/controllers/AdController')
const PurcharseController = require('./app/controllers/purchaseController')

const routes = express.Router()

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

// ads
routes.get('/showAll', authMiddlaware, AdController.findall)
routes.get('/show/:id', AdController.show)
routes.put('/edit/:id', AdController.update)
routes.delete('/delete/:id', AdController.delete)
routes.post('/create', authMiddlaware, AdController.create)

// purchase
routes.post('/purchase', authMiddlaware, PurcharseController.store)
module.exports = routes
