module.exports = function(backEndRouter, passport, authorize){
    backEndRouter.route('/login')
    //local login
    .post(passport.authenticate('local-login', {
        failureRedirect:'/api/profile',
        successRedirect:'/api/profile',
        failureFlash: false
    }));
    
    //log out
    backEndRouter.route('/logout')
    .post(function(req,res){
        req.logout();
        res.redirect('/api/profile');
    })
    
    backEndRouter.route('/profile')
    .get(authorize.isAdminOrOwnRoute, function(req, res){
        res[200](req.user);
    });
    
    return backEndRouter;
};
