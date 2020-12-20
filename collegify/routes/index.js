var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Collegify' });
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login');
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.get('/protegida', verificaAutenticacao, function (req, res) {
  res.redirect('/users')
})

function verificaAutenticacao(req, res, next) {
  if (req.isAuthenticated()) {
    //req.isAuthenticated() will return true if user is logged in
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
