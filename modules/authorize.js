require('json-response');
const Role = require('../models/Role');


authorize = {
isLoggedIn(req, res, next){
    if(req.isAuthenticated())
        return next();
    else
        res[401]('', 'not logged in');
},

isLoggedInFrontend(req, res, next){
    if(req.isAuthenticated()){
        Role.findById(req.user.role, function(err, role){
            if(err){res[500](err); return; }
            if(role.name == 'admin'){
                return next()
            } else {
                res[401]('', 'unauthorized, admin rights are needed for this route');
                return;
            }
        });
    }
    else{
        res.render('login.jade', {message: req.flash('loginMessage')});
    }
},

isAdmin(req, res, next){
    if(req.isAuthenticated()){
        Role.findById(req.user.role, function(err, role){
            if(err){res[500](err); return; }
            if(role.name == 'admin'){
                return next()
            } else {
                res[401]('', 'unauthorized, admin rights are needed for this route');
                return;
            }
        });
    }
    else{
        res[401]('', 'not logged in');
    }
},

isAdminOrOwnRoute(req, res, next){
    if(req.isAuthenticated()){
        Role.findById(req.user.role, function(err, role){
            if(err){res[500](err); return; }
            if(role.name == 'admin'){
                return next()
            } else {
                if (req.params.id == req.user._id){
                    return next()
                } else {
                    res[401]('', 'unauthorized, admin rights are needed for this route');
                    return;
                }
            }
        });
    }
    else{
        res[401]('', 'not logged in');
    }    
}
}

module.exports = authorize;
