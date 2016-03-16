module.exports = function(backEndRouter, User, Role){
    backEndRouter.route('/user')
    .get(function(req, res){
        User.find()
            .exec(function(err, user){
            if (err){res[500](err);return;}
            res[200](user);
        })
    })
    .post(function(req, res){
        var user = new User();
        if (!req.body.email){res[400]('no email given'); return;};
        if (!req.body.password){res[400]('no password given'); return;};
        if (!req.body.role){res[400]('no role given'); return;};
        Role.findOne({ name: req.body.role}, function (err, role){
            if(!role){res[400]('no valid role given');return;};
            
            var user = new User();
            user.local.email = req.body.email;
            user.local.password = req.body.password;
            user.role = role._id;
            user.save(function(err){
                if (err){
                    res[500](err);
                    return;
                }
                res[201](user);
            });
        });
    });
    
    backEndRouter.route('/user/:id')
    .get(function(req, res){
        User.findById(req.params.id)
            .populate('role')
            .exec(function(err, user){
            if (err){res[500](err);return;}
            res[200](user);
        });
    })
    .put(function(req,res){
        User.findById(req.params.id, function(err, user){
            if(err){
                res[500](err);
                return;
            }
            if (req.body.email){ user.local.email = req.body.email;};
            if (req.body.password){ user.local.password = req.body.password;};
            if (req.body.role){
                Role.findOne({ name: req.body.role}, function (err, role){
                    if(!role){
                        res[400]('no valid role given');
                        return;
                    };
                    user.role = role._id;
            })};
            user.save(function(err){
                if(err){res[500](err); return;}
                res[200](user);
            });
        })
    })
    .delete(function(req, res){
        User.remove({
            _id: req.params.id
        }, function(err, user){
            if(err){
                res[500](err);
            }
            res[200](user);
        });
    });
    
    //backEndRouter.route('/user/:id/role')
    
    return backEndRouter;
};