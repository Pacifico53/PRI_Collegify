var express = require('express');
var router = express.Router();

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


function verificaAutenticacao(req, res, next) {
  if (req.isAuthenticated()) {
      //req.isAuthenticated() will return true if user is logged in
      next();
  } else {
      res.redirect("/login");
  }
}

module.exports = router;
