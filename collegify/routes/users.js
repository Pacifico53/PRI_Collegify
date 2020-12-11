var express = require('express');
var router = express.Router();
const User = require('../controllers/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
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

module.exports = router;
