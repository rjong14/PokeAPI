module.exports = function(backEndRouter, Location, authorize){
    backEndRouter.route('/locations')
    .get(authorize.isAdmin, function(req,res){
        Location.find(function(err, locations){
            if (err){res[500](err);return;}
            res[200](locations);
        })
    })
    .post(authorize.isAdmin, function(req, res){
        var location = new Location;
        if(!req.body.startLong){res[500]('no startLong given');return;};
        if(!req.body.endLong){res[500]('no endLong given');return;};
        if(!req.body.startLat){res[500]('no startLat given');return;};
        if(!req.body.endLat){res[500]('no endLat given');return;};
        if(!req.body.pokeid){res[500]('no pokeid given');return;};
        location.startLong = req.body.startLong;
        location.endLong = req.body.endLong;
        location.startLat = req.body.startLat;
        location.endLat = req.body.endLat;
        location.pokeid = req.body.pokeid;
        location.save(function(err){
            if (err){ res[500](err); return; }
            res[200](location);
        })
    });
    
    backEndRouter.route('/locations/:locationId')
    .get(authorize.isAdmin, function(req, res){
        Location.findById(req.params.locationId, function(err, location){
            if(err){res[500](err);return;}
            res[200](location)
        })
    })
    
    .put(authorize.isAdmin, function(req, res){
        Location.findById(req.params.locationId, function(err, location){
            if (err){res[500](err);return;}
            if(req.body.startLong){location.startLong = req.body.startLong};
            if(req.body.endLong){location.endLong = req.body.endLong};
            if(req.body.startLat){location.startLat = req.body.startLat};
            if(req.body.endLat){location.endLat = req.body.endLat};
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
            res[200](location);
        })
    })
    
    return backEndRouter;
};