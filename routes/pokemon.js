var http = require("http");

module.exports = function(backEndRouter, passport){
    backEndRouter.route('/pokemon')
    .get(function(req,res){
        
    })
    
    return backEndRouter;
};