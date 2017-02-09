'use strict'

const path = require('path')

const express = require('express')
const passport = require('passport')
const session = require('express-session')

const authentication = require('./authentication')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'))

authentication.initialize(passport)

app.use(passport.initialize())

app.get('/secret',
  passport.authenticate('basic', { session: false }),
  function (req, res) {
    res.json({
      hello: 'world'
    })
  }
)

module.exports = app
