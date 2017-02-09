'use strict'

const path = require('path')

const express = require('express')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')

const authentication = require('./authentication')

const app = express()

app.set('view engine', 'pug')
app.set('views', path.resolve(__dirname, 'views'))

authentication.initialize(passport)

app.use(expressFlash())
app.use(express.static('public'))
app.use(cookieParser())
app.use(bodyParser())
app.use(session({ secret: 'risingstack' }))
app.use(passport.initialize())
app.use(passport.session())

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
  })
)

app.get('/secret',
  passport.authenticationMiddleware(),
  function (req, res) {
    res.render('index', { title: 'Hey', message: 'Hello there!' })
  }
)

app.get('/login',
  function (req, res) {
    res.render('login')
  }
)

module.exports = app
