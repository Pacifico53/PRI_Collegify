var mongoose = require('mongoose')

var Schema = new mongoose.Schema({
  type: String,
  title: String,
  subtitle: String,
  path: String,
  uploader: String,
  description: String,
  dateCreation: Date,
  dateRegister: { type: Date, default: Date.now },
  visibility: String,
  comments: [{ body: String, date: Date }],
  tags: [String],
  meta: {
    votes: { type: Number, default: 0 },
    favs: { type: Number, default: 0 },
  }
});

//METER LISTA DE USERS QUE DERAM LIKE
module.exports = mongoose.model('Post', Schema, 'posts')