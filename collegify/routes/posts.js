var express = require('express');
var router = express.Router();
var fs = require('fs')
var passport = require('passport')

const Post = require('../controllers/post');

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

/* GET posts page. */
router.get('/', verificaAutenticacao, function (req, res, next) {
    Post.listar()
        .then(dados => res.render('posts', {
            lista: dados
        }))
        .catch(e => res.render('error', {
            error: e
        }))
});

// POST regista novo post
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

// POST regista novo post
router.get('/upload', (req, res) => {
    res.render('posts/upload')
})

router.post('/files', upload.single('myFile'), function (req, res) {
    console.log(JSON.stringify(req.file));
    let quarantinePath = __dirname + '/../' + req.file.path
    let newPath = __dirname + '/../public/postStore/' + req.file.originalname

    fs.rename(quarantinePath, newPath, function (error) {
        if (error) {
            res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
            res.write('<p>Erro: ao mover o ficheiro da quarentena.' + error + '</p>')
            res.end()
        }
        else {
            var post = {
                title: req.body.title,
                path: newPath,
                uploader: req.body.uploader,
                description: req.body.description,
            }

            Post.inserir(post)
                .then(() => res.redirect('/posts'))
                .catch(e => res.render('error', {
                    error: e
                }))
        }
    })
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
