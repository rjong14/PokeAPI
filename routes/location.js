module.exports = function(backEndRouter, Location, authorize, authenticate){
    backEndRouter.route('/locations')
    .get(authenticate.duoAuth,authorize.isAdmin, function(req,res){
        Location.find(function(err, locations){
            if (err){res[500](err);return;}
            res[200](locations);
        })
    })
    .post(authorize.isAdmin, function(req, res){
        var location = new Location;
        if(!req.body.lat){res[500]('no lat given');return;};
        if(!req.body.lng){res[500]('no lng given');return;};
        if(!req.body.pokeid){res[500]('no pokeid given');return;};
        location.latlng.lat = req.body.lat;
        location.latlng.lng = req.body.lng;
        location.pokeid = req.body.pokeid;
        location.save(function(err){
            if (err){ res[500](err); return; }
            res[200](location);
        })
    });
    
    backEndRouter.route('/locations/:locationId')
    .get(authenticate.duoAuth, authorize.isAdmin, function(req, res){
        Location.findById(req.params.locationId, function(err, location){
            if(err){res[500](err);return;}
            res[200](location)
        })
    })
    
    .put(authorize.isAdmin, function(req, res){
        Location.findById(req.params.locationId, function(err, location){
            if (err){res[500](err);return;}
            if(req.body.lng){location.latlng.lng = req.body.lng};
            if(req.body.lat){location.latlng.lat = req.body.lat};
            if(req.body.pokeid){location.pokeid = req.body.pokeid};
            location.save(function(err){
                if(err){res[500](err);return;}
                res[200](location);
            })
        }
    )})
    
    .delete(authorize.isAdmin, function(req, res){
        Location.remove({_id: req.params.locationId}, function(err, location){
            if(err){res[500](err); return;}
            res[200](location, 'deleted');
        })
    })
    
    return backEndRouter;
};
