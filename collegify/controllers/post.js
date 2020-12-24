var Post = require('../models/post')

// Devolve uma lista de Posts
module.exports.listar = () => {
    return Post
        .find()
        .exec()
}

// Devolve um Post por 'id'
module.exports.consultar = id => {
    return Post
        .findOne({
            _id: id
        })
        .exec()
}

// Insere um novo Post
module.exports.inserir = p => {
    var novo = new Post(p)
    return novo.save()
}

// Elimina um Post por 'id'
module.exports.eliminar = id => {
    return Post
        .deleteOne({
            _id: id
        })
}

// Atualiza um Post por 'id'
module.exports.atualizar = (id, Post) => {
    return Post
        .updateOne({
            _id: id
        }, Post)
}

// Devolve uma lista de Posts por 'titulo'
module.exports.lookUpTitle = titulo => {
    return Post
        .find({
            title: titulo
        })
        .exec()
}