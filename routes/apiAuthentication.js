module.exports = function (backEndRouter, passport, authorize) {
    backEndRouter.route('/login')
        //local login
        .post(passport.authenticate('local-login', {
            failureRedirect: '/api/profile',
            successRedirect: '/api/profile',
            failureFlash: false
        }));

    backEndRouter.route('/token')
        .post(passport.authenticate('jwt-login'), function (req, res) {
            //res[200](req.token);
            res.json(req.token)
        });

    //log out
    backEndRouter.route('/logout')
        .post(function (req, res) {
            req.logout();
            res.redirect('/api/profile');
        });

    backEndRouter.get('/profile', function (req, res, next) {
        passport.authenticate(['auth', 'jwt-auth'], function (err, user, info) {
            if (err) {
                res[500]
            } else {
                next();
            }
        })(req, res, next);
    }, authorize.isAdminOrOwnRoute, function (req, res) {
        res[200](req.user);
    });


    return backEndRouter;
};
