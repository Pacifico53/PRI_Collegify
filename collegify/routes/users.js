var express = require('express');
var router = express.Router();
const User = require('../controllers/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
    User.listar()
        .then(dados => res.render('users', {
            lista: dados
        }))
        .catch(e => res.render('error', {
            error: e
        }))
});

//POST regista novo user
router.post('/signup', (req, res) => {
    var user = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    User.inserir(user)
        .then(() => res.redirect('/users'))
        .catch(e => res.render('error', {
            error: e
        }))
})

// DELETE user using POST
router.post("/delete/:idUser", function (req, res) {
    User.eliminar(req.params.idUser)
        .then(() => {
            res.render('deleted')
        })
        .catch(e => res.render('error', {
            error: e
        }))
})

// POST Update user
router.post('/update/:idUser', (req, res) => {
    var idUser = req.params.idUser
    var user = req.body
    User.atualizar(idUser, user)
        .then(() => {
            res.render('userUpdate')
        })
        .catch(e => res.render('error', {
            error: e
        }))
})

//GET user page
router.get('/:idUser', (req, res) => {
    var idUser = req.params.idUser
    User.consultar(idUser)
        .then(dados => res.render('user', {
            infouser: dados
        }))
        .catch(e => res.render('error', {
            error: e
        }))
})

module.exports = router;
