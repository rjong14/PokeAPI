module.exports = function(backEndRouter, Role){
    backEndRouter.route('/roles')
    .get(function(req, res){
        Role.find(function(err, role){
            if (err){
                res[500](err);
                return;
            }
            res[200](role);
        })
    })
    .post(function(req, res){
        var role = new Role;
        if (!req.body.name){
            res[400]('no name given');
            return;
        }
        role.name = req.body.name;
        role.save(function(err){
            if(err){
                res[500](err);
                return;
            }
            res[200](role);
        })
    });
    
    backEndRouter.route('/roles/:id')
    .put(function(req, res){
        Role.findById(req.params.id), function(err, role){
            if (err){
                res[500](err);
                return;
            }
            if (!req.body.name){
                res[400]('no new name was given');
                return;
            }
            role.name = req.body.name;
            role.save(function(err){
                if (err){
                    res[500](err);
                    return;
                }
                res[200](role);
            })
        }
    })
    .delete(function(req, res){
        Role.remove({_id: req.params.id}, function(err, role){
            if(err){
                res[500](err);
            }
            res[200](role);
        });
    });
    
    return backEndRouter;
}