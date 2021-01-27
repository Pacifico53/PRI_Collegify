var express = require('express');
var router = express.Router();

const Post = require('../controllers/post');

/* GET all cursos. */
router.get('/', verificaAutenticacao, function (req, res, next) {
  Post.listar()
    .then(dados => res.render('cursos/cursos', {
      title: 'Lista de Cursos',
      lista: dados
    }))
    .catch(e => res.render('error', {
      error: e
    }))
});

// GET cadeiras de curso de certo ano e semestre.
router.get('/:idCurso/ano/:ano/semestre/:sem', verificaAutenticacao, (req, res) => {
  Post.listarDeCursoAnoSemestre(req.params.idCurso, req.params.ano, req.params.sem)
    .then(dados => res.render('cursos/cursoAnoSemestre', {
      title: 'Cadeiras de ' + req.params.idCurso + ' ' + req.params.ano + 'º ano ' + req.params.sem + 'º semestre',
      lista: dados,
      path: req.originalUrl,
    }))
    .catch(e => res.render('error', {
      error: e
    }))
});

// GET posts de curso de certo ano, semestre e uc.
router.get('/:idCurso/ano/:ano/semestre/:sem/uc/:uc', verificaAutenticacao, (req, res) => {
  Post.listarDeCursoAnoSemestreUC(req.params.idCurso, req.params.ano, req.params.sem, req.params.uc)
    .then(dados => res.render('cursos/cursoUC', {
      title: 'Posts de ' + req.params.idCurso + ' ' + req.params.ano +
             'º ano ' + req.params.sem + 'º semestre ' + req.params.uc,
      lista: dados,
    }))
    .catch(e => res.render('error', {
      error: e
    }))
});


// GET semestres de ano de curso.
router.get('/:idCurso/ano/:ano', verificaAutenticacao, (req, res) => {
  Post.listarDeCursoAno(req.params.idCurso, req.params.ano)
    .then(dados => res.render('cursos/cursoAno', {
      title: 'Semestres de ' + req.params.idCurso + ' no ' + req.params.ano + 'º ano',
      lista: dados,
      path: req.originalUrl
    }))
    .catch(e => res.render('error', {
      error: e
    }))
});


// GET anos de curso.
router.get('/:idCurso', verificaAutenticacao, (req, res) => {
  Post.listarDeCurso(req.params.idCurso)
    .then(dados => res.render('cursos/curso', {
      title: 'Lista de Anos de ' + req.params.idCurso,
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
