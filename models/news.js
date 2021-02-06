var mongoose = require('mongoose')

var NewsSchema = new mongoose.Schema({
    typeNew: { type: String, required: true }, // Post || Comment
    typePost: { type: String },                // Post Only
    description: { type: String },             // Post Only
    title: { type: String },                   // Post Only
    autor: { type: String, required: true },   
    date: { type: Date, default: Date.now },
    comment: { type: String }                  // Comment Only

});

module.exports = mongoose.model('Newws', NewsSchema, 'news') 