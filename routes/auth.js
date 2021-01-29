var express = require('express');
var router = express.Router();
var passport = require('passport')

// Google
// GET to autenticate/signup
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// GET google callback 
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    if ('password' in req.user) {
      res.redirect('/main')
    } else {
      // TODO adicionar a pagina de password
      res.redirect('/main')
    }
  });

// Facebook
// TODO
// Github
// TODO

module.exports = router;