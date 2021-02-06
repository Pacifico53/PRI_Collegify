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

module.exports.lookUpGoogleID = id => {
  return User
    .findOne({
      googleID: id
    })
    .exec()
}

module.exports.lookUpFacebookID = id => {
  return User
    .findOne({
      facebookID: id
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

// Adiciona um favorito
module.exports.addFavourite = (idUser, idPost) => {
  this.consultar(idUser)
    .then(dados => {
      const listfavs = dados.favPostIds
      if (!listfavs.includes(idPost)) {
        dados.favPostIds.push(idPost)
      }
      dados.save()
    })
}
