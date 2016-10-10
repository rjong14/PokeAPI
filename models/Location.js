// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var locationSchema = mongoose.Schema({
    latlng: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    pokeid: {
        type: Number,
        required: true
    }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Location', locationSchema);
