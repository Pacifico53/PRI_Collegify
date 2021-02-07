var mongoose = require('mongoose')

var NewsSchema = new mongoose.Schema({
    typeNew: { type: String, required: true }, // Post || Comment
    typePost: String,                // Post Only
    description: String,             // Post Only
    title: String,                   // Post Only
    autor: { type: String, required: true },
    date: { type: Date, default: Date.now },
    comment: String,                 // Comment Only
    ogpost: String
});

module.exports = mongoose.model('News', NewsSchema, 'news') 