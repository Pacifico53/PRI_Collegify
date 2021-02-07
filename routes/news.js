var express = require('express');
var router = express.Router();
var { verificaAutenticacao } = require('./common');
const News = require('../controllers/news');

// GET feed page.
router.get('/', verificaAutenticacao, function (req, res) {
  News.listar10()
    .then(dados => res.render('news/news', {
      title: 'Feed de Notícias',
      lista: dados
    }))
    .catch(e => res.render('error', {
      error: e
    }))
});

module.exports = router;
