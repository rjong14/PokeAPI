// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var locationSchema = mongoose.Schema({
    startLong : { type: Number, required: true },
    startLat : { type: Number, required: true },
    endLong : { type: Number, required: true },
    endLat : { type: Number, required: true },
    pokeid : { type: Number, required: true }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Location', locationSchema);