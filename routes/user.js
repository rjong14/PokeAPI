module.exports = function(backEndRouter, User){
    backEndRouter.route('/user')
    .get(function(req, res){
        User.find(function(err, user){
            if (err){
                res[500](err);
                return;
            }
            res[200](user);
        })
    })
    .post(function(req, res){
        var user = new User();
        if (!req.body.username || !req.body.password){
            res[400]('no username or password given')
            return;
        }
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.save(function(err){
            if (err){
                res[500](err);
                return;
            }
            res[201](user);
        });
    });
    
    backEndRouter.route('/user/:id')
    .get(function(req, res){
        User.findById(req.params.id), function(err, user){
            if (err){
                res[500](err);
                return;
            }
            res[200](user);
        };
    })
    .put(function(req,res){
        User.findById(req.params.id, function(err, user){
            if(err){
                res[500](err);
                return;
            }
            if (req.body.username){
                user.username = req.body.username;
            }
            if (req.body.password){
                user.password = req.body.password;
            }
            user.save(function(err){
                if(err){
                    res[500](err);
                    return;
                }
            });
            res[200](user);
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
    
    return backEndRouter;
};