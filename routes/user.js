var http = require('http');

module.exports = function(backEndRouter, User, Role){
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
           
//           callback = function(response) {
//              var txt = '';
//
//              //another chunk of data has been recieved, so append it to `txt`
//              response.on('data', function (chunk) {
//                txt += chunk;
//              });
//
//               response.on('error', function(e) {
//                console.log("Got error: " + e.message);
//               });
//
//              //the whole response has been recieved, so we just print it out here
//              response.on('end', function () {
//                  var json = JSON.parse(txt);
//                console.log(json.name);
//              });
//            }

           var poke = user.pokemon;
           var ifready = function (mons, poke){
               console.log(mons + '-'+ poke.length);
                if (mons == poke.length){
                   console.log('lol');

                   res[200](poke);
               }
           }

           for(mons in poke){
            callback = function(response) {
              var txt = '';

              //another chunk of data has been recieved, so append it to `txt`
              response.on('data', function (chunk) {
                txt += chunk;
              });

               response.on('error', function(e) {
                console.log("Got error: " + e.message);
               });

              //the whole response has been recieved, so we just print it out here
              response.on('end', function () {
                  var json = JSON.parse(txt);
                  poke[mons].name = json.name;
                console.log(json.name);
                  ifready(mons, poke);
              });
            };
                options.path = '/api/v2/pokemon/'+ poke[mons].pokeid +'/';

               console.log(options.path);
                http.get(options, callback).end();
               //poke[mons].name = 'lol'+poke[mons].pokeid;


           }


           
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
