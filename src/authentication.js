'use strict'

const crypto = require('crypto')
const LocalStrategy = require('passport-local').Strategy
const _ = require('lodash')

const database = require('./database')

// It is very important to only store password hashes, in case of data breach the attacker doesn't have access to your
// user's passwords
function hashPassword (password) {
  return crypto.createHmac('sha256', 'risingstack' /* this is a secret */)
    .update(password)
    .digest('hex')
}

// Prevents timing attacks
function validatePassword (userPassword, providedPassword) {
  return crypto.timingSafeEqual(Buffer.from(userPassword), Buffer.from(hashPassword(providedPassword)))
}

function authenticationMiddleware () {
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
}

function initialize (passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    const user = _.find(database, {id: id})
    done(null, user)
  })

  passport.use(new LocalStrategy(
    function(username, password, done) {
      const user = _.find(database, { name: username })

      if (!user || !validatePassword(user.password, password)) {
        return done(null, false)
      }
      return done(null, user)
    }
  ))

  passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = {
  initialize,
  authenticationMiddleware
}
