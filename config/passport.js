// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var jwtconfig = require('./jwtconfig');
var jwt = require("jwt-simple");
var opts = {
    jwtFromRequest: ExtractJwt.fromHeader('token'),
    secretOrKey: jwtconfig.jwtSecret,
    passReqToCallback: true
};

// load the auth variables
var configAuth = require('./auth');

// expose this function to our app using module.exports
module.exports = function (passport, User, Role) {


    passport.use('jwt-auth', new JwtStrategy(opts, function (req, jwt_payload, done) {
        console.log('jwtjwtjwt')
        console.log(jwt_payload);
        User.findById(jwt_payload.id)
            .populate('role')
            .exec(function (err, user) {
                if (err) {
                    done(err, false);
                }
                req.session.passport.user = user;
                done(null, user);
            });
    }));
    
        passport.use('auth', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            if(req.session.passport.user !== undefined){
               return done(null, user);
            } else{
                done(err, false);
            }

        }));

    passport.use('jwt-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
        console.log('jwt login');
            User.findOne({
                'local.email': email
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
                var payload = {
                    id: user.id
                };
                var token = jwt.encode(payload, jwtconfig.jwtSecret);
                req.token = {
                    token: token
                };
                return done(null, user);
            });
        }));



    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({
                    'local.email': email
                }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);

                        Role.findOne({
                            name: 'user'
                        }, function (err, role) {
                            if (!role) {
                                return done(null, false, req.flash('signupMessage', 'Internal server error. Please contact administrator'));
                            }
                            newUser.role = role._id;
                            newUser.save(function (err) {
                                if (err) {
                                    throw err;
                                }
                                return done(null, newUser);
                            });
                        });
                    }
                })
            })
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            User.findOne({
                'local.email': email
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }
                if (!user.validPassword(password)) {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
                return done(null, user);
            });
        }));

    passport.use('facebook', new FacebookStrategy({
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: configAuth.facebookAuth.profileFields
        },
        // facebook will send back the token and profile
        function (token, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({
                    'facebook.id': profile.id
                }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        newUser.facebook.email = profile.emails[0].value;

                        Role.findOne({
                            name: 'user'
                        }, function (err, role) {
                            if (!role) {
                                return done(null, false, req.flash('signupMessage', 'Internal server error. Please contact administrator'));
                            }
                            newUser.role = role._id;
                            newUser.save(function (err) {
                                if (err) {
                                    throw err;
                                }
                                return done(null, newUser);
                            });
                        });
                    }
                });
            });
        }));

    passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
        },
        function (token, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({
                    'google.id': profile.id
                }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = new User();
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value;

                        Role.findOne({
                            name: 'user'
                        }, function (err, role) {
                            if (!role) {
                                return done(null, false, req.flash('signupMessage', 'Internal server error. Please contact administrator'));
                            }
                            newUser.role = role._id;
                            newUser.save(function (err) {
                                if (err) {
                                    throw err;
                                }
                                return done(null, newUser);
                            });
                        });
                    }
                });
            });

        }));

};
