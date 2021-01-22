var express = require('express');
var router = express.Router();
var fs = require('fs')
var passport = require('passport')

const Post = require('../controllers/post');

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

// GET posts page.
router.get('/', verificaAutenticacao, function (req, res, next) {
  Post.listar()
    .then(dados => res.render('posts/posts', {
      title: 'Lista de Posts',
      lista: dados
    }))
    .catch(e => res.render('error', {
      error: e
    }))
});

// GET upload page
router.get('/upload', verificaAutenticacao, (req, res) => {
  res.render('posts/upload', {
    title: 'Upload'
  })
})

// POST upload file
router.post('/upload', upload.single('myFile'), (req, res) => {
  let quarantinePath = __dirname + '/../' + req.file.path
  let newPath = __dirname + '/../public/postStore/' + req.file.originalname

  fs.rename(quarantinePath, newPath, (error) => {
    if (error) {
      res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
      res.write('<p>Erro: ao mover o ficheiro da quarentena.' + error + '</p>')
      res.end()
    }
    else {
      var post = {
        type: req.body.type,
        title: req.body.title,
        subtitle: req.body.subtitle,   // Opcional
        filename: req.file.originalname,
        uploader: req.user.username,
        description: req.body.description,
        visibility: req.body.visibility,
        tags: req.body.tags.split(" "),
        meta: {
          curso: req.body.curso,
          ano: req.body.ano,
          semestre: req.body.semestre
        }
      }

      Post.inserir(post)
        .then(() => res.redirect('/posts'))
        .catch(e => res.render('error', {
          error: e
        }))
    }
  })
})

//GET download 
router.get('/download/:filename', function (req, res) {
  res.download(__dirname + '/../public/postStore/' + req.params.filename)
})

//POST comment
router.post('/comment/:idPost', function (req, res) {
  var comment = {
    body: req.body.comment,
    user: req.user.username,
  }
  Post.addComment(req.params.idPost, comment);
  res.redirect('back');
})

//POST favorito
router.post('/fav/:idPost', function (req, res) {
  Post.addFavourite(req.params.idPost, req.user.username);
  res.redirect('back');
})

//POST like
router.post('/like/:idPost', function (req, res) {
  Post.addLike(req.params.idPost, req.user.username);
  res.redirect('back');
})

//POST like comment
router.post('/likeComment/:index/:idPost', function (req, res) {
  Post.addLikeToComment(req.params.idPost, req.user.username, req.params.index);
  res.redirect('back');
})



// GET post page.
router.get('/:idPost', verificaAutenticacao, (req, res) => {
  var post = req.params.idPost
  Post.consultar(post)
    .then(dados => res.render('posts/post', {
      title: 'Post',
      post: dados
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
