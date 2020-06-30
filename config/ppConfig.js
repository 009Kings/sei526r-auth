// Import necessary libraries
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

// serialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

// Deserialized
passport.deserializeUser((id, cb) => {
  db.user.findByPk(id).then(user => {
    cb(null, user);
  }).catch(cb)
})

// Password local config
passport.user(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, cb) => {
  db.user.findOne({ where: { email } }).then(user => {
    if (!user || !user.validPassword(password)) {
      cb(null, false)
    } else {
      cb(null, user)
    }
  }).catch(cb)
}))

module.exports = passport;