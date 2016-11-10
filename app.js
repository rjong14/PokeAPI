//load in all modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require("jwt-simple");
var flash = require('connect-flash');
var session = require('express-session')
var configDB = require('./config/database.js');
var chalk = require('chalk');
var cors = require('cors');
var async = require('async');
require('json-response');
var authorize = require('./modules/authorize');
var authenticate = require('./modules/authenticate');
var geometry = require('./modules/geometry');
var pinklog = require('./modules/pinklog');

//make app and router
var backEndRouter = express.Router();
var frontEndRouter = express.Router();
var app = express();
// call socket.io to the app
app.io = require('socket.io')();

//models
var Role = require('./models/Role');
var User = require('./models/User');
var Location = require('./models/Location');

process.env.VERBOSE = 'true';

//configuration
mongoose.connect(configDB.url);
require('./config/passport')(passport, User, Role);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport stuff
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//declare routes
var frontendRoute = require('./routes/frontend')(frontEndRouter, User, Role, Location, async, authorize);
var authenticationRoute = require('./routes/authentication')(frontEndRouter, passport);
var apiAuthenticationRoute = require('./routes/apiAuthentication')(backEndRouter, passport, authorize, authenticate);
var roleRoutes = require('./routes/role')(backEndRouter, Role, authorize);
var locationRoutes = require('./routes/location')(backEndRouter, Location, authorize, authenticate);
var userRoutes = require('./routes/user')(backEndRouter, User, Role, Location, async, authorize, authenticate, pinklog);
                                          
//load in routes
app.use('/api', backEndRouter);
app.use('/', frontEndRouter);

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
    err.reqlink = req.url
    next(err);
});

// error handlers->
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// start listen with socket.io
app.io.on('connection', function(socket){
  console.log(chalk.red('IMA ') + chalk.green('CHRGN ') + chalk.magenta('MA LZR'));
});

module.exports = app;
