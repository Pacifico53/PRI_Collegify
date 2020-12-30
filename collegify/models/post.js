var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CommentSchema = new Schema({
    body: String,
    user: String,
    likes: { type: Number, default: 0 },
    date: Date
})

var PostSchema = new Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: String,
    path: String,
    uploader: String,
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
        votes: { type: Number, default: 0 },
        favs: [String], //nomes de users que deram fav
    }
});

module.exports = mongoose.model('Post', PostSchema, 'posts')