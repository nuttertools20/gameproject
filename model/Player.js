var mongoose = require('mongoose');
var Player = new mongoose.Schema({
    nick: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    admin: {
    	type: Boolean,
    	default: false,
    },
    updated: { 
    	type: Date, 
    	default: Date.now
    },
});

module.exports = mongoose.model('Player', Player);