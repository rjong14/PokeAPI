var async = require('async');

function mainRepository() {
    this.Model = null;
};

mainRepository.prototype.SetModel = function(model, doneCallback){
    async.parallel([
        function(callback){
            this.Model = model
            allback(null)
        }
    ],
    function(err){
        return doneCallback(null);
    });
};

mainRepository.prototype.GetAll = function(){
    console.log('in getAll');
    Model.find(function(err, data){
        if (err){res[500](err);return;}
        console.log(data)
    });
};

mainRepository.prototype.output = function(){
    console.log('model is ' + this.Model)
};

module.exports = mainRepository;