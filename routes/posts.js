var express = require('express');
var router = express.Router();
var fs = require('fs')
var passport = require('passport')

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


// GET post edit page
router.get('/:idPost/edit', verificaAutenticacao, (req, res) => {
  var idPost = req.params.idPost
  Post.consultar(idPost)
    .then(dados => res.render('posts/edit', {
      title: 'Editar Post',
      post: dados,
      idPost: idPost
    }))
    .catch(e => res.render('error', {
      error: e
    }))
})

// POST edit post TODO ISTO VSI DESAPARECER E SO VAI DAR PARA APAGAR
router.post('/:idPost/edit', (req, res) => {
  var idPost = req.params.idPost

  var post = {
    type: req.body.type,
    title: req.body.title,
    subtitle: req.body.subtitle,
    uploader: req.user.username,
    description: req.body.description,
    visibility: req.body.visibility,
    // tags: req.body.tags,.split(" "),
    meta: {
      curso: req.body.curso,
      ano: req.body.ano,
      semestre: req.body.semestre,
      cadeira: req.body.cadeira
    }
  }

  Post.atualizar(idPost, post)
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

      console.log(post);
      Post.inserir(post)
        .then(() => res.redirect('/posts'))
        .catch(e => res.render('error', {
          error: e
        }))

      if (req.body.visibility == "Público") {
        var news = {
          typeNew: "Post",
          postId: req.body._id,
          typePost: req.body.type,
          title: req.body.title,
          autor: req.user.username,
          description: req.body.description
        }

        News.inserir(news)
          .then(dados => console.log('New adicionada: Novo Post' + dados))
          .catch(e => console.log("Erro ao adicionar News de Post" + e))
      }
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
    comment: req.body.comment
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

//       res.render('posts/posts', {
//         title: 'Lista de Posts',
//         lista: filteredList
//       })
//     })
//     .catch(e => res.render('error', {
//       error: e
//     }))
// })