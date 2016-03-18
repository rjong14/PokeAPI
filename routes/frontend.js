module.exports = function (frontEndRouter, User) {
    frontEndRouter.route('/')
        .get(function (req, res) {
            res.render('index', {
                title: 'Home'
            });
        });
    frontEndRouter.route('/users')
        .get(function (req, res) {
            User.find()
                .exec(function (err, users) {
                    if (err) {
                        console.log("something went wrong")
                    }
                var user = new User();
                    console.log('lol');
                    console.log(users);
                    res.render('users', {
                        title: 'Users',
                        users: users,
                        user: user
                    });
                })

        });
    frontEndRouter.route('/users/:id')
        .get(function (req, res) {
            User.findById(req.params.id)
                .populate('role')
                .exec(function (err, user) {
                    if (err) {
                        console.log("something went wrong");
                    }
                    User.find()
                        .exec(function (err, users) {
                            if (err) {
                                console.log("something went wrong");
                            }
                            console.log('lol');
                            console.log(users);
                            res.render('users', {
                                title: 'Users',
                                users: users,
                                user: user
                            });
                        })
                });

        });
    frontEndRouter.route('/locations')
        .get(function (req, res) {
            res.render('locations', {
                title: 'Locations'
            });
        });

    return frontEndRouter;
};
