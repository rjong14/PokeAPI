module.exports = function(backEndRouter, passport){
    backEndRouter.route('/login')
    .get(function(req, res){
        res.render('login.jade', {message: req.flash('loginMessage')});
    })
    .post(passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }));
    
    backEndRouter.route('/logout')
    .get(function(req,res){
        req.logout();
        res.redirect('/');
    })
    
    return backEndRouter;
};

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect('/');
    }
};