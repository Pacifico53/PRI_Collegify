var express = require('express');
var router = express.Router();
var passport = require('passport')

const User = require('../controllers/user');

// GET users listing.
router.get('/', function (req, res, next) {
    User.listar()
        .then(dados => res.render('users/users', {
            title: "Lista de Users",
            lista: dados
        }))
        .catch(e => res.render('error', {
            error: e
        }))
});

// GET '/users/logout' to clean cookie
router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy(function (err) {
        if (!err) {
            res.clearCookie('cookie');
            res.redirect('/');
        } else {
            console.log('Destroy session error: ', err)
        }
    });
});

// POST '/users/login'  login
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
    res.redirect('/main')
})

// POST regista novo user
router.post('/signup', (req, res) => {
    var user = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        curso: req.body.curso,
        password: req.body.password
    }
    User.inserir(user)
        .then(() => res.redirect('/login'))
        .catch(e => res.render('error', {
            error: e
        }))
})

// POST delete user
router.post("/delete/:idUser", function (req, res) {
    User.eliminar(req.params.idUser)
        .then(() => {
            res.render('users/deleted')
        })
        .catch(e => res.render('error', {
            error: e
        }))
})

// POST update user
router.post('/update/:idUser', (req, res) => {
    var idUser = req.params.idUser
    var user = req.body
    User.atualizar(idUser, user)
        .then(() => {
            res.render('users/userUpdate')
        })
        .catch(e => res.render('error', {
            error: e
        }))
})

//GET user page
router.get('/profilePage', (req, res) => {
    var idUser = req.user._id
    User.consultar(idUser)
        .then(dados => res.render('users/user', {
            infouser: dados,
            checksame: true,
            title: "Página de Perfil"
        }))
        .catch(e => res.render('error', {
            error: e
        }))
})

//GET user page
router.get('/:uname', (req, res) => {
    var uname = req.params.uname;
    var checksame = false

    if (uname == req.user.username) {
        checksame = true;
    }

    User.lookUpUsername(uname)
        .then(dados => res.render('users/user', {
            infouser: dados,
            checksame: checksame,
            title: "Página de Perfil"
        }))
        .catch(e => res.render('error', {
            error: e
        }))
})

module.exports = router;
