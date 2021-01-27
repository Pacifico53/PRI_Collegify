var mongoose = require('mongoose')

var Schema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String,
    level: String,
    dateRegister: { type: Date, default: Date.now },
    dateLast: { type: Date, default: Date.now },
    curso: String,
    affiliation: String,
    favPostIds: [String],
    googleID: String
});

module.exports = mongoose.model('User', Schema, 'users')