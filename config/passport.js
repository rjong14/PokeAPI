// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function(passport, User) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err){ return done(err); }
            if (user) { return done(null, false, req.flash('signupMessage', 'That email is already taken.')); }
            else {
                var newUser            = new User();
                newUser.local.email    = email;
                newUser.local.password = newUser.generateHash(password);

                newUser.save(function(err) {
                    if (err){ throw err; }
                    return done(null, newUser);
                });
            }
        });    

        });

    }));

    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, req.flash('loginMessage', 'No user found.')); }
            if (!user.validPassword(password)) { return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); }
            
            return done(null, user);
        });

    }));
    
    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },
    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                if (err){return done(err);}
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();
                    newUser.facebook.id    = profile.id;
                    newUser.facebook.token = token;                  
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                    newUser.facebook.email = profile.emails[0].value;
                    
                    newUser.save(function(err) {
                        if (err){throw err;}
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

};