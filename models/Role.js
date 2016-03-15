// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var roleSchema = mongoose.Schema({
    id               : String,
    name             : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Role', roleSchema);