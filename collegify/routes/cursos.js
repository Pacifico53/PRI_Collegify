var express = require('express');
var router = express.Router();

const Post = require('../controllers/post');

/* GET all cursos. */
router.get('/', verificaAutenticacao, function (req, res, next) {
  Post.listar()
    .then(dados => res.render('cursos/cursos', {
      lista: dados
    }))
    .catch(e => res.render('error', {
      error: e
    }))
});

// GET curso page.
router.get('/:idCurso', verificaAutenticacao, (req, res) => {
  Post.listarDeCurso(req.params.idCurso)
    .then(dados => res.render('cursos/curso', {
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
