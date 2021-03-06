module.exports = function(frontEndRouter, passport){
    frontEndRouter.route('/login')
    .get(function(req, res){
        res.render('login.jade', {message: req.flash('loginMessage')});
    })
    
    //local login
    .post(passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }));
    
    frontEndRouter.route('/signup')
    .post(passport.authenticate('local-signup', {
        successRedirect : '/',
        failureRedirect : '/signup',
        failureFlash : true
    }));
    
    frontEndRouter.route('/auth/facebook')
    .get(passport.authenticate('facebook', {
        scope : 'email' 
    }));

    frontEndRouter.route('/auth/facebook/callback')
    // handle the callback after facebook has authenticated the user
    .get(passport.authenticate('facebook', {
        successRedirect : '/api/profile',
        failureRedirect : '/login',
        scope:['email']
    }));
    
    frontEndRouter.route('/auth/google')
    .get(passport.authenticate('google', {
        scope : ['profile', 'email']
    }));
    
    frontEndRouter.route('/auth/google/callback')
    .get(passport.authenticate('google', {
        successRedirect : '/api/profile',
        failureRedirect : '/login'
    }));
    
    //log out
    frontEndRouter.route('/logout')
    .post(function(req,res){
        req.logout();
        res.redirect('/');
    })
    
    return frontEndRouter;
};
