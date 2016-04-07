module.exports = function(backEndRouter){
    backEndRouter.route('/locations')
    .get(function(req,res){
        Location.find(function(err, locations){
            if (err){res[500](err);return;}
            res[200](locations);
        })
    })
    .post(function(req, res){
        var location = new Location;
        if(!req.body.startLong){res[500]('no start longitude given');return;};
        if(!req.body.endLong){res[500]('no end longitude given');return;};
        if(!req.body.startLat){res[500]('no start latitude given');return;};
        if(!req.body.endLat){res[500]('no end latitude given');return;};
        location.startLong = req.body.startLong;
        location.endLong = req.body.endLong;
        location.startLat = req.body.startLat;
        location.endLat = req.body.endlat;
        location.save(function(err){
            if (err){ res[500](err); return; }
            res[200](location);
        })
    });
    
    backEndRouter.route('/locations/:id')
    .get(function(req, res){
        
    })
    
    return backEndRouter;
};