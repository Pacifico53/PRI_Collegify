var mongoose = require('mongoose')

var Schema = new mongoose.Schema({
  title: String,
  path: String,
  uploader: String,
  description: String,
  date: { type: Date, default: Date.now },
  comments: [{ body: String, date: Date }],
  tags: [String],
  meta: {
    votes: { type: Number, default: 0 },
    favs: { type: Number, default: 0 },
  }
});

module.exports = mongoose.model('Post', Schema, 'posts')