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
    
    //app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
    
    frontEndRouter.route('/auth/facebook')
        .get(passport.authenticate('facebook', { scope : 'email' }));      
//    frontEndRouter.route('/auth/facebook')
//    // route for facebook authentication and login
//    .get(function(req, res){
//        console.log('testing')
//        passport.authenticate('facebook', { scope : 'email' });
//    });

    frontEndRouter.route('/auth/facebook/callback')
    // handle the callback after facebook has authenticated the user
    .get(passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/',
        scope:['email']
    }));
    
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