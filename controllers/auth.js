// require express
const express = require('express');
// import router
const router = express.Router();
// import db
const db = require('../models');
// import middleware

// ROUTES
router.get('/register', (req, res) => {
  res.render('auth/register');
})

// sign up