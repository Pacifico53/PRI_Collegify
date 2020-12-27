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
            lista: dados
        }))
        .catch(e => res.render('error', {
            error: e
        }))
});

// GET upload page
router.get('/upload', verificaAutenticacao, (req, res) => {
    res.render('posts/upload')
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
                subtitle: req.body.subtitle, // Opcional
                title: req.body.title,
                path: newPath,
                uploader: req.user.username,
                description: req.body.description,
                visibility: req.body.visibility
            }

            Post.inserir(post)
                .then(() => res.redirect('/posts'))
                .catch(e => res.render('error', {
                    error: e
                }))
        }
    })
})

// GET post page.
router.get('/:idPost', verificaAutenticacao, (req, res) => {
    var post = req.params.idPost
    Post.consultar(post)
        .then(dados => res.render('posts/post', {
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
