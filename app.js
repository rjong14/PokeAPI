//load in all modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session')
var configDB = require('./config/database.js');
require('json-response');

//make app and router
var backEndRouter = express.Router();
var frontEndRouter = express.Router();
var app = express();

//configuration
mongoose.connect(configDB.url);
//require('./config/passport')(passport); uncomment after implementing passport fully

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport stuff
app.use(session({secret: 'secret', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//models

//declare routes
var frontendRoute = require('./routes/frontend')(frontEndRouter);
var authenticationRoute = require('./routes/authentication')(backEndRouter, passport);

//load in routes
app.use('/api', backEndRouter);
app.use('/', frontEndRouter);
app.use(frontendRoute);
app.use(authenticationRoute)

//Middleware
backEndRouter.get('/', function (req, res) {
    res.json({
        message: 'hooray! welcome to our api!!'
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message
            , error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message
        , error: {}
    });
});


module.exports = app;
