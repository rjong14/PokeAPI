            .get(function (req, res) {
                User.findById(req.params.id)
                    .exec(function (err, user) {
                        if (err) {
                            res[500](err);
                            return;
                        }
                        res[200](user);
                    });

                            var options = {
                                host: 'pokeapi.co',
                                port: 80,
                                path: '/api/v2/pokemon/1/'
                            };

                            var poke = '';

                                poke = user.pokemon;



                    async.parallel([function (callback) {

                    },
                    function (callback) {
                                        for (mons in poke) {
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
                                                    poke[mons].name = json.name;
                                                    console.log(json.name);
                                                    ifready(mons, poke);
                                                });
                                            };
                                            options.path = '/api/v2/pokemon/' + poke[mons].pokeid + '/';
                                            console.log(options.path);
                                            http.get(options, jsoncall).end();
                                            //poke[mons].name = 'lol'+poke[mons].pokeid;

                                        }

                        }],
                                function (err, data) {
                                    res[200](poke);
                                })

                        })
