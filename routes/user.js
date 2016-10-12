var http = require('http');

module.exports = function (backEndRouter, User, Role, Location, async, authorize, passport, geometry) {
    backEndRouter.route('/users')
        .get(authorize.isAdmin, function (req, res) {
        var page = 1;
        if (req.query.page > 0){
            page = req.query.page;
        }
        var skip = page*10;
        skip = skip-10;
        
        User.find()
            .skip(skip)
            .limit(10)
            .exec(function (err, user) {
            if (err) {
                res[500](err);
                return;
            }
            res[200](user, 'ok');


        })
    })
        .post(authorize.isAdmin, function (req, res) {
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
                    if (err) {res[500](err);return;}
                    res[201](user, 'created');
                });
            });
        });

    backEndRouter.route('/users/:id')
        .get(authorize.isAdminOrOwnRoute, function (req, res) {
            User.findById(req.params.id)
                .populate('role')
                .exec(function (err, user) {
                    if (err) {res[500](err);return;}
                    res[200](user, 'ok');
                });
        })
        .put(authorize.isAdminOrOwnRoute, function (req, res) {
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
                ],
                function(err){
                    user.save(function(err){
                        if (err) { res[500](err);return;}
                        res[200](user);
                    })
                })
            })
    })
    .delete(authorize.isAdminOrOwnRoute, function (req, res) {
        User.remove({
                _id: req.params.id
            }, function (err, user) {
                if (err) {
                    res[500](err);
                    return;
                }
                res[200](user, 'deleted');
            });
        });

    backEndRouter.route('/users/:id/pokemon')
        .get(function (req, res, next) {
        passport.authenticate(['auth', 'jwt-auth'], function (err, user, info) {
            if (err) {
                res[500]
            } else {
                next();
            }
        })(req, res, next);
    },authorize.isAdminOrOwnRoute, function (req, res) {
        var options = {
            host: 'pokeapi.co',
            port: 80,
            path: '/api/v2/pokemon/1/'
        };
        var poke = '';


        async.series({
            one: function(callback){
                //console.log('first');
                User.findById(req.params.id)
                    .exec(function (err, user) {
                    if (err) {res[500](err);return;}
                    poke = user.pokemon;
                    //console.log('beginning');
                    callback(null, 1);
                });
            },
            two: function(callback){
                //console.log('second');
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
                            //console.log(json.name);
                        });
                    };
                    options.path = '/api/v2/pokemon/' + item.pokeid + '/';
                    //console.log(options.path);
                    http.get(options, jsoncall);
                    eachcb();
                }, function () {
                    setTimeout(function(){
                    callback(null, newpoke);
                    }, 5000);
                });
            }
        },function(err, results) {
            //console.log(results.two);
            res[200](results.two);
        });

    })
    .post(authorize.isAdminOrOwnRoute, function(req, res){
        User.findById(req.params.id, function(err, user){
            if(err){res[500](err);return;}
            
            if (!req.body.pokeid){res[400]('no pokeid given'); return;};
            console.log(req.body.pokeId);
            user.pokemon.push({pokeid : req.body.pokeid, caught_at: new Date()})
            user.save(function(err){
                if(err){res[500](err);return;}
                res[200](user);
            })
        })
    });

    backEndRouter.route('/users/:id/pokemon/:pokeid')
        .delete(authorize.isAdminOrOwnRoute, function (req, res) {
        User.findById(req.params.id, function (err, user) {
            if (err) {
                res[500](err, 'error');
                return;
            }
            user.pokemon.pull({
                _id: req.params.pokeid
            });
            user.save(function (err) {
                if (err) {
                    res[500](err, 'error');
                    return;
                }
                res[200](user, 'deleted');
            })
        })
    });
    
    backEndRouter.route('/users/:id/location')
    .post(function (req, res, next) {
        passport.authenticate(['auth', 'jwt-auth'], function (err, user, info) {
            if (err) {
                res[500]
            } else {
                next();
            }
        })(req, res, next);
    },authorize.isAdminOrOwnRoute, function(req, res){
        if(!req.body.lng){res[500]('no long given');return;};
        if(!req.body.lat){res[500]('no lat given');return;};
        console.log('time to catch!');
        var area = { center: [parseInt(req.body.lat), parseInt(req.body.lat)], radius: 0.0002, unique: true, spherical: true };
        Location
        .where('latlng')
        .within()
        .circle(area)
        .lean()
        .exec(function(err, data){
            console.log('in the exec');
            console.log(data);
            console.log(err);
            if(err){res[500](err);return;}
            if(!data[0]){res[400]('no data found');return;}
            console.log(data[0].pokeid);
            
            User.findById(req.params.id, function(err, user){
                var test = user.toObject();
                user.pokemon.push({pokeid : data[0].pokeid, caught_at: new Date()})
                console.log('adding'+ data[0].pokeid)
                user.save(function(err){
                    if(err){res[500](err, 'error');return;}
                    res[200](user);
                })
            })
        })
    })

    return backEndRouter;
};
