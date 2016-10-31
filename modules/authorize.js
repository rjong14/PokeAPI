require('json-response');
const Role = require('../models/Role');
const User = require('../models/User');
const jwtconfig = require('../config/jwtconfig');


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
},
isUserGiveToken(req, res, next){
        console.log('token is black');
        console.log(req.body);
            if (req.isAuthenticated()) {
                console.log('great success');
                var email = req.body.email;
                var password = req.body.password;
                console.log(req);
                res[200];



//                var user = User.find(function (u) {
//                    return u.email === email && u.password === password;
//                });
//                if (user) {
//                    console.log(user);
//                    var payload = {
//                        id: user.id
//                    };
//                    var token = jwt.encode(payload, jwtconfig.jwtSecret);
//                    res.json({
//                        token: token
//                    });
//                } else {
//                    res[401];
//                }
            } else {
                res[401];
            }
}
}

module.exports = authorize;
