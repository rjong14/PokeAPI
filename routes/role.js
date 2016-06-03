module.exports = function(backEndRouter, Role, authorize){
    backEndRouter.route('/roles')
    .get(authorize.isAdmin, function(req, res){
        Role.find(function(err, role){
            if (err){
                res[500](err);
                return;
            }
            res[200](role);
        })
    })
    .post(authorize.isAdmin, function(req, res){
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
    
    backEndRouter.route('/roles/:roleId')
    .put(authorize.isAdmin, function(req, res){
        Role.findById(req.params.roleId), function(err, role){
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
    .delete(authorize.isAdmin, function(req, res){
        Role.remove({_id: req.params.roleId}, function(err, role){
            if(err){
                res[500](err);
            }
            res[200](role);
        });
    });
    
    return backEndRouter;
}