var mongoose = require('mongoose')
var crypto = require('crypto')
var db = mongoose.connect("mongodb://localhost:27017/players")
var Player = require('./model/Player')

// User API

exports.createUser = function(userData){
	var user = {
		nick: userData.nick,
		password: hash(userData.password),
		email: userData.email,
		admin: userData.admin
	}
	return new Player(user).save();
}

exports.getUser = function(id) {
	return Player.findOne(id)
}

exports.checkUser = function(userData) {
	return Player
		.findOne({nick: userData.nick})
		.then(function(doc){
			if ( doc.password == hash(userData.password) ){
				console.log("User password is ok");
				return Promise.resolve(doc)
			} else {
				return Promise.reject("Error wrong")
			}
		})
}

function hash(text) {
	return crypto.createHash('sha1')
	.update(text).digest('base64')
}