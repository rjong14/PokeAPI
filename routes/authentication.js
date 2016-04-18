module.exports = function(frontEndRouter, passport){
    frontEndRouter.route('/login')
    .get(function(req, res){
        res.render('login.jade', {message: req.flash('loginMessage')});
    })
    
    //local login
    .post(passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));
    
    frontEndRouter.route('/auth/facebook')
    // route for facebook authentication and login
    .get(function(req, res){
        passport.authenticate('facebook', { scope : 'email' });
    });

    frontEndRouter.route('/auth/facebook/callback')
    // handle the callback after facebook has authenticated the user
    .get(function(req, res){
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        });
    });
    
    //log out
    frontEndRouter.route('/logout')
    .post(function(req,res){
        req.logout();
        res.redirect('/');
    })
    
    return frontEndRouter;
};

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/');
    }
};