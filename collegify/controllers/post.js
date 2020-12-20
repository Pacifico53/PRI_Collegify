var Post = require('../models/post')

// Devolve a lista de alunos
module.exports.listar = () => {
    return Post
        .find()
        .exec()
}

module.exports.consultar = id => {
    return Post
        .findOne({
            _id: id
        })
        .exec()
}


module.exports.inserir = p => {
    var novo = new Post(p)
    return novo.save()
}

module.exports.eliminar = id => {
    return Post
        .deleteOne({
            _id: id
        })
}

module.exports.atualizar = (id, Post) => {
    return Post
        .updateOne({
            _id: id
        }, Post)
}
