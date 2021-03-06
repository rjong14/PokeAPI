var http = require('http');

module.exports = function (backEndRouter, User, Role, Location, async, authorize, authenticate, pinklog) {
        backEndRouter.route('/users')
            .get(authenticate.duoAuth, authorize.isAdmin, function (req, res) {
                pinklog.log("in the get");
                var page = 1;
                if (req.query.page > 0) {
                    page = req.query.page;
                }
                var skip = page * 10;
                skip = skip - 10;
                User.find()
                    .skip(skip)
                    .limit(10)
                    .exec(function (err, user) {
                        if (err) {pinklog.error("err");res[500](err);return;}
                        if (req.headers['isandroid']) {res.json(user);
                        }else{pinklog.log("not android");
                            res[200](user, 'ok');
                        }
                    })
            })
            .post(authorize.isAdmin, function (req, res) {
                var user = new User();
                if (!req.body.email) {res[400]('no email given');return;};
                if (!req.body.password) {res[400]('no password given');return;};
                if (!req.body.role) {res[400]('no role given');return;};
                Role.findOne({name: req.body.role}, function (err, role) {
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
            .get(authenticate.duoAuth, authorize.isAdminOrOwnRoute, function (req, res) {
                if (req.headers['isandroid']) {
                    User.findById(req.params.id)
                        .exec(function (err, user) {
                            if (err) {res[500](err);return;}
                            res.json(user);
                        });
                } else {
                    User.findById(req.params.id)
                        .populate('role')
                        .exec(function (err, user) {
                            if (err) {res[500](err);return;}
                            res[200](user, 'ok');
                        });
                }
            })
            .put(authenticate.duoAuth, authorize.isAdminOrOwnRoute, function (req, res) {
                    pinklog.log("In put")
                    async.waterfall([
                            function (callback) {
                                User.findById(req.params.id, function (err, user) {
                                    if (err) {callback(err);return;}
                                    pinklog.log("user found")
                                    if (req.body.email) {user.local.email = req.body.email;};
                                    if (req.body.password) {user.local.password = user.generateHash(req.body.password);};
                                    if (req.body.pwd) {user.local.password = user.generateHash(req.body.pwd);};
                                    callback(null, user);
                                })
                            },
                            function (user, callback) {
                                if (req.body.role) {
                                    Role.findOne({name: req.body.role}, function (err, role) {
                                        if (!role) {callback(err);return;};
                                        user.role = role._id;
                                        callback(null, user);
                                    })
                                } else {
                                    callback(null, user);
                                }
                            }
                        ],function (err, user) {
                        pinklog.log(user);
                            user.save(function (err) {
                                    if (err) {res[500](err);return;}
                                    if (req.headers['isandroid']) {
                                        res.json(user);
                                    } else {
                                        res[200](user, 'ok');
                                    }
                                });
                            });
                    })
                .delete(authorize.isAdminOrOwnRoute, function (req, res) {
                    User.remove({
                        _id: req.params.id
                    }, function (err, user) {
                        if (err) {res[500](err);return;}
                        res[200](user, 'deleted');
                    });
                });

                backEndRouter.route('/users/:id/pokemon')
                .get(authenticate.duoAuth, authorize.isAdminOrOwnRoute, function (req, res) {
                    var options = {host: 'pokeapi.co', port: 80, path: '/api/v2/pokemon/1/'};
                    var poke = '';
                    async.series({
                        one: function (callback) {
                            User.findById(req.params.id)
                                .exec(function (err, user) {
                                    if (err) {res[500](err);return;}
                                    poke = user.pokemon;
                                    callback(null, 1);
                                });
                        },
                        two: function (callback) {
                            var newpoke = poke;
                            async.eachSeries(newpoke, function (item, eachcb) {
                                jsoncall = function (res) {
                                    var txt = '';
                                    res.on('data', function (chunk) {
                                        txt += chunk;
                                    });
                                    res.on('end', function () {
                                        var json = JSON.parse(txt);
                                        item.name = json.name;
                                        eachcb();
                                    });
                                };
                                options.path = '/api/v2/pokemon/' + item.pokeid + '/';
                                http.get(options, jsoncall)
                                    .on('error', function (e) {
                                        eachcb();
                                    });
                            }, function () {
                                callback(null, newpoke);
                            });
                        }
                    }, function (err, results) {
                        res[200](results.two, 'ok');
                    });

                })
                .post(authorize.isAdminOrOwnRoute, function (req, res) {
                    User.findById(req.params.id, function (err, user) {
                        if (err) {res[500](err);return;}
                        if (!req.body.pokeid) {res[400]('no pokeid given');return;};
                        user.pokemon.push({
                            pokeid: req.body.pokeid,
                            caught_at: new Date()
                        })
                        user.save(function (err) {
                            if (err) {res[500](err);return;}
                            res[200](user, 'ok');
                        })
                    })
                });

                backEndRouter.route('/users/:id/pokemon/:pokeid')
                .delete(authorize.isAdminOrOwnRoute, function (req, res) {
                    User.findById(req.params.id, function (err, user) {
                        if (err) {res[500](err, 'error');return;}
                        user.pokemon.pull({
                            _id: req.params.pokeid
                        });
                        user.save(function (err) {
                            if (err) {res[500](err, 'error');return;}
                            res[200](user, 'deleted');
                        })
                    })
                });

                backEndRouter.route('/users/:id/location')
                .post(authenticate.duoAuth, authorize.isAdminOrOwnRoute, function (req, res) {
                    if (!req.body.lng) {res[500]('no long given');return;};
                    if (!req.body.lat) {res[500]('no lat given');return;};
                    var area = {
                        center: [parseFloat(req.body.lat), parseFloat(req.body.lng)], radius: 0.00001, unique: true, spherical: true};
                    Location
                        .where({_id: req.body.id})
                        .where('latlng')
                        .within()
                        .circle(area)
                        .lean()
                        .exec(function (err, data) {
                            if (err) {res[500](err);return;}
                            if (!data[0]) {res[400]('no data found');return;}

                            User.findById(req.params.id, function (err, user) {
                                var test = user.toObject();
                                user.pokemon.push({
                                    pokeid: data[0].pokeid,
                                    caught_at: new Date()
                                })
                                user.save(function (err) {
                                    if (err) {res[500](err, 'error');return;}
                                    var newres = {
                                        pokeid: data[0].pokeid
                                    };
                                    res[200](newres, 'ok');
                                })
                            })
                        })
                })
                return backEndRouter;
            };
