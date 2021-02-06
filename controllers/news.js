var News = require('../models/news')

// Devolve a lista de News
module.exports.listar = () => {
    return News
      .find()
      .exec()
}

// Insere a new New now
module.exports.inserir = n => {
    var novo = new News(n)
    return novo.save()
}

// Devolve a lista de 10 News
module.exports.listar10 = () => {
    return News
      .find()
      .sort({'date': -1})
      .limit(10)
      .exec()
}

// Devolve uma lista de News 'Publicas'
/*
module.exports.newsPublicas = privacy => {
    return News
      .find({
        privacy: "Público"
      })
      .exec()
}
*/ 
//Todas as news são publicas?