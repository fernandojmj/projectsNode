const express = require('express')
const mongoose = require('mongoose')
const Youch = require('youch')
const ValidateExpress = require('express-validation')
const databaseConfig = require('./config/database')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'
    this.database()
    this.middlewares()
    this.routes()
    this.exception()
  }

  database () {
    // mogodb://
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middlewares () {
    this.express.use(express.json())
  }

  routes () {
    this.express.use(require('./routes'))
  }

  exception () {
    this.express.use(async (err, req, res, next) => {
      if (err instanceof ValidateExpress.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err)

        return res.json(await youch.toJSON())
      }
      return res
        .status(err.status || 500)
        .json({ error: 'internal sever erro' })
    })
  }
}

module.exports = new App().express
