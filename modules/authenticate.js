const passport = require('passport');

var authenticate = {
    duoAuth(req, res, next) {
        passport.authenticate(['auth', 'jwt-auth'], function (err, user, info) {
            if (err) {res[500];return;}
            else {next();}
        })(req, res, next);
    }
}

module.exports = authenticate;
