var express = require('express');
var router = express.Router();
var { verificaAutenticacao } = require('./common');

const News = require('../controllers/news');

/* GET home page. */
router.get('/', function (req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/main');
  } else {
    res.render('index', { title: 'Collegify' });
  }
});

/* GET login page. */
router.get('/login', function (req, res) {
  res.render('login', { title: 'Login' });
});

/* GET signup page. */
router.get('/signup', function (req, res) {
  res.render('signup', { title: 'Registar' });
});

/* GET main page. */
router.get('/main', verificaAutenticacao, function (req, res) {
  News.listar10()
    .then(dados => res.render('main', {
      title: 'Collegify',
      username: req.user.name,
      lista: dados
    }))
    .catch(e => res.render('error', {
      error: e
    }))
});

module.exports = router;
