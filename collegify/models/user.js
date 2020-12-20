var mongoose = require('mongoose')

var Schema = new mongoose.Schema({
    name: String,
    email: String,
    username: String,
    password: String,
});

module.exports = mongoose.model('User', Schema, 'users')