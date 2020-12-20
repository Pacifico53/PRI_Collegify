var express = require('express');
const Post = require('../controllers/post');
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

/* GET posts page. */
router.get('/posts', function (req, res, next) {
  Post.listar()
  .then(dados => res.render('posts', {
      lista: dados
  }))
  .catch(e => res.render('error', {
      error: e
  }))
});

// POST regista novo user
router.post('/upload', (req, res) => {
  var post = {
      title: req.body.title,
      path: req.body.path,
      uploader: req.body.uploader,
      description: req.body.description,
      tags: req.body.tags
  }
  Post.inserir(post)
      .then(() => res.redirect('/posts'))
      .catch(e => res.render('error', {
          error: e
      }))
})


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
