var http = require('http');

module.exports = function(backEndRouter, User, Role, Location){
    backEndRouter.route('/users')
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
            user.local.password = user.generateHash(req.body.password);
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
    
    backEndRouter.route('/users/:id')
    .get(function(req, res){
        User.findById(req.params.id)
            .populate('role')
            .exec(function(err, user){
            if (err){res[500](err);return;}
            res[200](user);
        });
    })
    .put(function(req,res){
        var us = null;
        User.findById(req.params.id, function(err, user){
            if(err){
                res[500](err);
                return;
            }
            if (req.body.email){ user.local.email = req.body.email;};
            if (req.body.password){ user.local.password = user.generateHash(req.body.password);};
            if (req.body.role){
                Role.findOne({ name: req.body.role}, function (err, role){
                    if(!role){ res[400]('no valid role given'); return; };
                    user.role = role._id;
                    us = user;
            })};

        }).exec(function(err, data){
                us.save(function(err){
                    console.log('2nd exec');
                if(err){res[500](err); return;}
                res[200](data);
            });
        })
    })
    .delete(function(req, res){
        User.remove({ _id: req.params.id}, function(err, user){
            if(err){ res[500](err); return; }
            res[200](user);
        });
    });
    
    backEndRouter.route('/users/:id/pokemon')
    .get(function(req, res){
       User.findById(req.params.id, function(err, user){
           if(err){res[500](err);return;}
           //res[200](user.pokemon);
           //var pokemons = user.pokemon;
           //for (key in pokemons){
           //    console.log(pokemons[key]);
           //}
           
           
           
           var options = {
               host: 'pokeapi.co',
               port: 80,
               path: '/api/v2/pokemon/1/'
           };
           var response;
           
           http.get(options, function(api) {
               api.setEncoding('utf8');
               api.on('data', function(chunk) {
                   response += chunk;
               });
               api.on('end', function(ending) {
                   console.log('No more data in response')
                   console.log('logging response:')
                   response = response.slice(9);
                   //json.parse(response);
                   var json = JSON.parse(response);
                   console.log(response.name);
               });
           }).on('error', function(e) {
               console.log("Got error: " + e.message);
           });
           
       });
    })
    .post(function(req, res){
        User.findById(req.params.id, function(err, user){
            if(err){res[500](err);return;}
            
            if (!req.body.pokeid){res[400]('no pokeid given'); return;};
            console.log(req.body.pokeId);
            user.pokemon.push({pokeid : req.body.pokeid, caught_at: new Date()})
            user.save(function(err){
                if(err){res[500](err);return;}
                res[200](user);
            })
        });
    });
    
    backEndRouter.route('/users/:id/pokemon/:pokeid')
    .delete(function(req, res){
        User.findById(req.params.id, function(err, user){
            if(err){res[500](err);return;}
            user.pokemon.pull({_id: req.params.pokeid});
            user.save(function(err){
                if(err){res[500](err);return;}
                res[200](user);
            })
        })
    })
    
    backEndRouter.route('/users/:id/location')
    .post(function(req, res){
        Location
        .where('startLong').gte(req.body.long)
        .where('endLong').lte(req.body.long)
        .where('startLat').gte(req.body.lat)
        .where('endLat').lte(req.body.lat)
        .exec(function(err, data){
            if(err){res[500](err);return;}
            if(!data){res[400]('no data found');return;}  
        })
        
        
    })
    
    //backEndRouter.route('/users/role/:name')
    //.get(function(req, res){
    //    Role.findOne({'name': req.params.name}, function(err, role){
    //        if(err){ res[500](err); return; }
    //        if (!role) { res[400]('no valid role given'); return; };
    //        User.find({'name': role._id}, function(err, users){ //help, find doesnt work
    //            if(err){ res[500](err); return; }
    //            if(!users) { res[400]('no users found'); return; };
    //            res[200](users);
    //        })
    //    })
    //})
    
    return backEndRouter;
};
