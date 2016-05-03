var http = require('http');

module.exports = function (backEndRouter, User, Role, Location, async, UserRepo) {
    backEndRouter.route('/users')
        .get(function (req, res) {
//                    console.log('get');
//                    var lol = new UserRepo();
//                    lol
//                        .getAll()
//                        .res();
            User.find()
                .exec(function (err, user) {
                    if (err) {
                        res[500](err);
                        return;
                    }
                    res[200](user);
                })
        })
        .post(function (req, res) {
            var user = new User();
            if (!req.body.email)   {res[400]('no email given'); return;};
            if (!req.body.password){res[400]('no password given');return;};
            if (!req.body.role)    {res[400]('no role given');return;};
            Role.findOne({
                name: req.body.role
            }, function (err, role) {
                if (!role) {res[400]('no valid role given');return;};

                var user = new User();
                user.local.email = req.body.email;
                user.local.password = user.generateHash(req.body.password);
                user.role = role._id;
                user.save(function (err) {
                    if (err)      {res[500](err);return;}
                    res[201](user);
                });
            });
        });

    backEndRouter.route('/users/:id')
        .get(function (req, res) {
            User.findById(req.params.id)
                .populate('role')
                .exec(function (err, user) {
                    if (err) {res[500](err);return;}
                    res[200](user);
                });
        })
        .put(function (req, res) {
            var us = null;
            User.findById(req.params.id, function (err, user) {
                if (err) { res[500](err); return;}
                if (req.body.email) {
                    user.local.email = req.body.email;
                };
                if (req.body.password) {
                    user.local.password = user.generateHash(req.body.password);
                };
                async.parallel([
                    function(callback){
                        if (req.body.role) {
                            Role.findOne({name: req.body.role}, function (err, role) {
                                if (!role) {res[400]('no valid role given');return;};
                                user.role = role._id;
                                callback(null);
                            })
                        } else {
                            callback(null);
                        }
                    }
                ]),
                function(err1){
                    user.save(function(err){
                    if (err) { res[500](err);return;}
                    res[200](data);
                    })
                }
            })
    })
    .delete(function (req, res) {
        User.remove({
                _id: req.params.id
            }, function (err, user) {
                if (err) {
                    res[500](err);
                    return;
                }
                res[200](user);
            });
        });
    
    backEndRouter.route('/profile')
    //get logged in user
    .get(function(req, res){
        if(req.isAuthenticated()){
            res[200](req.user);
        } else {
            res[400]('user not logged in')
        }
    });

    backEndRouter.route('/users/:id/pokemon')
        .get(function (req, res) {
        var options = {
            host: 'pokeapi.co',
            port: 80,
            path: '/api/v2/pokemon/1/'
        };
        var poke = '';


        async.series({
            one: function(callback){
                console.log('first');
                User.findById(req.params.id)
                    .exec(function (err, user) {
                    if (err) {res[500](err);return;}
                    poke = user.pokemon;
                    console.log('beginning');
                    callback(null, 1);
                });
            },
            two: function(callback){
                console.log('second');
                var newpoke = poke;


                async.eachSeries(newpoke, function (item, eachcb) {
                    jsoncall = function (response) {
                        var txt = '';

                    //another chunk of data has been recieved, so append it to `txt`
                        response.on('data', function (chunk) {
                            txt += chunk;
                        });

                        response.on('error', function (e) {
                            console.log("Got error: " + e.message);
                        });

                        //the whole response has been recieved, so we just print it out here
                        response.on('end', function () {
                            var json = JSON.parse(txt);
                            item.name = json.name;
                            console.log(json.name);
                        });
                    };
                    options.path = '/api/v2/pokemon/' + item.pokeid + '/';
                    console.log(options.path);
                    http.get(options, jsoncall);
                    eachcb();
                }, function () {
                    setTimeout(function(){
                    callback(null, newpoke);
                    }, 5000);
                });
            }
        },function(err, results) {
            console.log(results.two);
            res[200](results.two);
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

    backEndRouter.route('/users/:id/pokemon/:pokeid')
        .delete(function (req, res) {
            User.findById(req.params.id, function (err, user) {
                if (err) {
                    res[500](err);
                    return;
                }
                user.pokemon.pull({
                    _id: req.params.pokeid
                });
                user.save(function (err) {
                    if (err) {
                        res[500](err);
                        return;
                    }
                    res[200](user);
                })
            })
        })
    })
    
    backEndRouter.route('/users/:id/location')
    .post(function(req, res){
        if(!req.body.long){res[500]('no long given');return;};
        if(!req.body.lat){res[500]('no lat given');return;};
        Location
        .where('startLong').lte(req.body.long)
        .where('endLong').gte(req.body.long)
        .where('startLat').lte(req.body.lat)
        .where('endLat').gte(req.body.lat)
        .lean()
        .exec(function(err, data){
            if(err){res[500](err);return;}
            if(!data){res[400]('no data found');return;}
            console.log(data[0].pokeid);
            
            User.findById(req.params.id, function(err, user){
                var test = user.toObject();
                user.pokemon.push({pokeid : data[0].pokeid, caught_at: new Date()})
                console.log('adding'+ data[0].pokeid)
                user.save(function(err){
                    if(err){res[500](err);return;}
                    res[200](user);
                })
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
