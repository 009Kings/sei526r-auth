// require express
const express = require('express');
// import router
const router = express.Router();
// import db
const db = require('../models');
// import middleware
const flash = require("flash");
// TODO update passport config file path
const passport = require('../config/ppConfig');

// ROUTES
router.get('/register', (req, res) => {
  res.render('auth/register');
})

router.get('/login', (req, res) => {
  res.render('auth/login')
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (!user) {
      req.flash('error', 'Invalid Username or Password')
      req.session.save(() => res.redirect('/auth/login'));
    }
    if (error) error

    req.login((user, err) => {
      if (err) next(err)
      req.flash('success', 'You are valid and logged in')
      req.session.save(() => res.redirect('/'))
    })
  })
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  successFlash: 'Welcome to our app',
  failureFlash: 'Invalid username or password'
}))

router.post('/register', (req, res) => {
  db.user.findOrCreate({
    where: {email: req.body.email},
    defaults: {
      name: req.body.name,
      password: req.body.password
    }
  })
  .then(([user, created]) => {
    // If user was created
    if (created) {
      // authenticate user and start authorization process
      console.log("user created! ✅")
      res.redirect("/")
    } else {
      //  else if user already exists
      console.log("user email already exists 🔥")
      req.flash('error', 'Error: email already exists for User, try again.')
      res.redirect('/auth/register');
    }
  })
  .catch(err => {
    console.log(`Error Found. 💩💩 \nPlease review — ${err.message}\n${err}`)
    req.flash('error', err.message);
    res.redirect('/auth/register')
  })
})

// sign up
module.exports = router;