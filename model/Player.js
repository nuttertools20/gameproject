var mongoose = require('mongoose');
var Player = new mongoose.Schema({
    login : {
        type: String,
        unique: true,
        required: true
    },
    pass : {
        type: String,
        required: true
    },
    isAdmin: {
    	type: Boolean,
    	default: false,
    },
    updated: { 
    	type: Date, 
    	default: Date.now
    },
});

module.exports = mongoose.model('Player', Player);