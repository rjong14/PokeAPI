var express = require('express');
var router = express.Router();

/* GET home page. */
router
    .get('/', function (req, res, next) {
        res.render('index', {
            title: 'Home'
        });
    })
    .get('/login', function (req, res, next) {
        res.render('login', {
            title: 'Login'
        });
    })
    .get('/users', function (req, res, next) {
        res.render('users', {
            title: 'Users'
        });
    })
    .get('/locations', function (req, res, next) {
        res.render('locations', {
            title: 'Locations'
        });
    })

module.exports = router;
