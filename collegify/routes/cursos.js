var express = require('express');
var router = express.Router();

const Post = require('../controllers/post');

/* GET all cursos. */
router.get('/', verificaAutenticacao, function (req, res, next) {
  Post.listar()
    .then(dados => res.render('cursos/cursos', {
      lista: dados,
    }))
    .catch(e => res.render('error', {
      error: e
    }))
});

// GET curso page.
router.get('/:idCurso/ano/:ano/semestre/:sem', verificaAutenticacao, (req, res) => {
  Post.listarDeCursoAnoSemestre(req.params.idCurso, req.params.ano, req.params.sem)
    .then(dados => res.render('cursos/cursoSemestre', {
      lista: dados,
      curso: req.params.idCurso,
      ano: req.params.ano,
      sem: req.params.sem
    }))
    .catch(e => res.render('error', {
      error: e
    }))
});


// GET curso page.
router.get('/:idCurso/ano/:ano', verificaAutenticacao, (req, res) => {
  Post.listarDeCursoAno(req.params.idCurso, req.params.ano)
    .then(dados => res.render('cursos/cursoAno', {
      lista: dados,
      path: req.originalUrl
    }))
    .catch(e => res.render('error', {
      error: e
    }))
});


// GET curso page.
router.get('/:idCurso', verificaAutenticacao, (req, res) => {
  Post.listarDeCurso(req.params.idCurso)
    .then(dados => res.render('cursos/curso', {
      lista: dados,
      path: req.originalUrl
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
