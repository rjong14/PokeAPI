require('json-response');
var Role = require('../models/Role');

var isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res[401]('', 'not logged in');
    }
};

var isAdmin = function(req, res, next){
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
        console.log('out of findbyid')
    }
    else{
        res[401]('', 'not logged in');
    }
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.isAdmin = isAdmin;