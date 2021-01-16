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

// Devolve uma lista de Posts de curso
module.exports.listarDeCurso = idCurso => {
  return Post
    .find({
      'meta.curso': idCurso
    })
    .exec()
}

// Devolve uma lista de Posts de curso de dado ano
module.exports.listarDeCursoAno = (idCurso, ano) => {
  return Post
    .find({
      'meta.curso': idCurso,
      'meta.ano': ano
    })
    .exec()
}

// Devolve uma lista de Posts de curso de dado ano e semestre
module.exports.listarDeCursoAnoSemestre = (idCurso, ano, sem) => {
  return Post
    .find({
      'meta.curso': idCurso,
      'meta.ano': ano,
      'meta.semestre': sem
    })
    .exec()
}

module.exports.addComment = (idPost, comment) => {
  this.consultar(idPost)
    .then(dados => {
      dados.comments.push(comment)
      dados.save()
    })
}

module.exports.addFavourite = (idPost, username) => {
  this.consultar(idPost)
    .then(dados => {
      const listfavs = dados.meta.favs
      if (!listfavs.contains(username)) {
        dados.meta.favs.push(username)
      }
      dados.save()
    })
}