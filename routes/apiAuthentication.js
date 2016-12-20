module.exports = function (backEndRouter, passport, authorize, authenticate) {
    backEndRouter.route('/login')
        //local login
        .post(passport.authenticate('local-login', {
            failureRedirect: '/api/profile',
            successRedirect: '/api/profile',
            failureFlash: false
        }));

    backEndRouter.route('/token')
        .post(passport.authenticate('jwt-login'), function (req, res) {
            if(req.headers['isandroid']){
                res.json(req.token);
            }else {
                res[200](req.token);
            }
        });

    //log out
    backEndRouter.route('/logout')
        .post(function (req, res) {
            req.logout();
            res.redirect('/api/profile');
        });

    backEndRouter.get('/profile', authenticate.duoAuth, function (req, res) {
        if(req.user){
            res[200](req.user);
        }else{
            res[400](null, "no good");
        }

    });


    return backEndRouter;
};
