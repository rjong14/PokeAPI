module.exports = function (frontEndRouter, User, Role, Location, async) {
    frontEndRouter.route('/')
        .get(function (req, res) {
            res.render('index', {
                title: 'Home'
            });
        });
    frontEndRouter.route('/users')
        .get(function (req, res) {
            var users = null;
            var roles = null;

            async.parallel([function (callback) {
                    User.find()
                        .exec(function (err, data) {
                            if (err) {
                                callback(err);
                                console.log("something went wrong")
                            }
                            users = data;
                            callback(null, data);
                        })
                },
                function (callback) {
                    Role.find()
                        .exec(function (err, data) {
                            if (err) {
                                callback(err);
                                console.log("something went wrong")
                            }
                            roles = data;
                            callback(null, data);
                        })
                }], function (err, data) {
                res.render('users', {
                    title: 'Users',
                    users: users,
                    roles: roles
                })
            })

        });

    frontEndRouter.route('/locations')
        .get(function (req, res) {
            Location.find()
            .exec(function(err, locations){
                if (err){res[500](err);return;}
                res.render('locations', {
                    title: 'Locations',
                    locations: locations
                });
            })


        });

    return frontEndRouter;
};
