var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CommentSchema = new Schema({
    body: String,
    user: String,
    likes: [String],
    date: { type: Date, default: Date.now }
})

var PostSchema = new Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: String,
    filename: String,
    uploader: { type: String, required: true }, // ir ao id do user
    description: String,
    dateCreation: { type: Date, default: Date.now },
    dateRegister: { type: Date, default: Date.now },
    visibility: String,
    comments: [CommentSchema],
    tags: [String],
    meta: {
        curso: String,
        ano: String,
        semestre: String,
        cadeira: String,
        votes: [String],
        favs: [String], //nomes de users que deram fav
    }
});

module.exports = mongoose.model('Post', PostSchema, 'posts')