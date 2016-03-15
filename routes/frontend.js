module.exports = function(frontEndRouter){
    frontEndRouter.route('/')
    .get(function(req, res){
        res.render('index', {
            title: 'Home'
        });
    });
    frontEndRouter.route('/users')
    .get(function(req, res){
        res.render('users', {
            title: 'Users'
        });
    });
    frontEndRouter.route('/locations')
    .get(function(req, res){
        res.render('locations', {
            title: 'Locations'
        });
    });
    
    return frontEndRouter;
};