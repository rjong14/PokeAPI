require('json-response');
var Role = require('../models/Role');


authorize = {
isLoggedIn : function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res[401]('', 'not logged in');
    }
},

isLoggedInFrontend : function(req, res, next){
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

isAdmin : function(req, res, next){
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

isAdminOrOwnRoute : function(req, res, next){
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
//module.exports.isLoggedIn = isLoggedIn;
//module.exports.isAdmin = isAdmin;
//module.exports.isAdminOrOwnRoute = isAdminOrOwnRoute;
