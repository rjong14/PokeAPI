module.exports = function (frontEndRouter, User, Role, Location, async, authorize) {
    frontEndRouter.route('/')
        .get(authorize.isLoggedInFrontend, function (req, res) {
            console.log(res.user);
            res.render('index', {
                title: 'Home',
                user: req.user
            });
        });
    frontEndRouter.route('/users')
        .get(authorize.isLoggedInFrontend, function (req, res) {
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
                    roles: roles,
                    user: req.user
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
                    locations: locations,
                    user: req.user
                });
            })


        });

    return frontEndRouter;
};
