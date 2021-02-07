var express = require('express');
var router = express.Router();
var fs = require('fs')
var passport = require('passport')
var { verificaAutenticacao } = require('./common');

const Post = require('../controllers/post');
const User = require('../controllers/user')
const News = require('../controllers/news')

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

// GET posts page.
router.get('/tag/:tag', verificaAutenticacao, function (req, res, next) {
  Post.listarTagged(req.params.tag)
    .then(dados => res.render('posts/taggedPosts', {
      title: 'Lista de Posts com Tag ' + req.params.tag,
      lista: dados
    }))
    .catch(e => res.render('error', {
      error: e
    }))
});

// GET delete post
router.get('/:idPost/delete', (req, res) => {
  var idPost = req.params.idPost

  Post.eliminar(idPost)
    .then(() => res.redirect('/posts'))
    .catch(e => res.render('error', {
      error: e
    }))
})

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
        subtitle: req.body.subtitle,
        filename: req.file.originalname,
        uploader: req.user.username,
        description: req.body.description,
        visibility: req.body.visibility,
        tags: req.body.tags.split(" "),
        meta: {
          curso: req.body.curso,
          ano: req.body.ano,
          semestre: req.body.semestre,
          cadeira: req.body.cadeira
        }
      }

      Post.inserir(post)
        .then(p => {
          res.redirect('/posts')

          if (p.visibility == "Público") {
            var ogpostId = 'posts/' + p._id.toString();

            var news = {
              typeNew: "Post",
              ogpost: ogpostId,
              typePost: p.type,
              title: p.title,
              autor: p.uploader,
              description: p.description
            }

            News.inserir(news)
              .then(dados => console.log('Adicionado ao feed: Novo Post' + dados))
              .catch(e => console.log("Erro ao adicionar News de Post" + e))
          }
        })
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

  var news = {
    typeNew: "Comment",
    autor: req.user.username,
    comment: req.body.comment,
    ogpost: 'posts/' + req.params.idPost
  }

  News.inserir(news)
    .then(() => console.log('NEW: Novo Comentário '))
    .catch(e => console.log("Erro ao adicionar News de Comentário " + e))

  res.redirect('back');
})

//POST favorito
router.post('/fav/:idPost', function (req, res) {
  Post.addFavourite(req.params.idPost, req.user.username);
  User.addFavourite(req.user._id, req.params.idPost);
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
    .then(dados => {
      var authorized = false;
      if (req.user.username == dados.uploader || req.user.level == 'admin') {
        authorized = true;
      }

      if (dados.visibility == 'Privado') {
        if (authorized) {
          res.render('posts/post', {
            title: 'Post',
            authorized: authorized,
            post: dados
          })
        }
        else {
          res.render('posts/privado', {
            title: 'Post Privado'
          });
        }
      }
      else {
        res.render('posts/post', {
          title: 'Post',
          authorized: authorized,
          post: dados
        })
      }

    })
    .catch(e => res.render('error', {
      error: e
    }))
});

module.exports = router;


// // GET search page
// router.get('/search', verificaAutenticacao, (req, res) => {
//   res.render('posts/search', {
//     title: 'Filtragem'
//   })
// })

// // POST search page
// router.post('/search', verificaAutenticacao, (req, res) => {
//   Post.listar()
//     .then(dados => {
//       var filteredList = []

//       dados.forEach(p => {

//       });

//       res.sts', {
//         title: 'Lista de Posts',
//         lista: filteredList
//       })
//     })
//     .catch(e => res.render('error', {
//       error: e
//     }))
// })