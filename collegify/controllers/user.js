var User = require('../models/user')

// Devolve a lista de alunos
module.exports.listar = () => {
    return User
        .find()
        .exec()
}

module.exports.consultar = id => {
    return User
        .findOne({
            _id: id
        })
        .exec()
}

module.exports.lookUpUsername = uname => {
    return User
        .findOne({
            username: uname
        })
        .exec()
}


module.exports.inserir = u => {
    var novo = new User(u)
    return novo.save()
}

module.exports.eliminar = id => {
    return User
        .deleteOne({
            _id: id
        })
}

module.exports.atualizar = (id, user) => {
    return User
        .updateOne({
            _id: id
        }, user)
}
