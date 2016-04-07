// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var locationSchema = mongoose.Schema({
    startLong : Number,
    startLat : Number,
    endLong : Number,
    endLat : Number,
    pokeid : Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Location', locationSchema);