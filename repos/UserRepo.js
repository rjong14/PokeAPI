var User = require('../models/User');

module.exports = UserRepo;

function UserRepo (){
    console.log('repo');
    this.user = User;
    return this;
};

UserRepo.prototype.data = '';

UserRepo.prototype.getAll = function (next) {
    this.user.find()
            .exec(function(err, response){
             console.log('lol');
             console.log(response);
            //if (err){res[500](err);return;}
            this.data = response;
        })
    return this;
}

UserRepo.prototype.res = function (next) {
    console.log('res');
    res[200](this.data);
}
/*
methods:
 - get
 - getAll
 - findBy....
 - remove
 - getWithRole
 
stuff to look up
 - interface
   - werkt dit in javascript of is het volledig overbodig
 - overerven
   - van main(?) repo
 - dependency injection
   - model injecten in main repo
*/