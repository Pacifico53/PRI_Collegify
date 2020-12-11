var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Collegify' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

module.exports = router;
