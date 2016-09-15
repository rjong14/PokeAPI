const User = require('../models/User');



const UserRepo = {
    user: User,
    data: '',
    getAll(next){
            this.user.find(function(err, response){
             console.log('lol');
             console.log(response);
            //if (err){res[500](err);return;}
            this.data = response;

        }).exec(function(err, response){return this;} )
    },
    res(next){
            console.log('res');
            res[200](this.data);
    }
};

module.exports = UserRepo;

//function UserRepo (){
//    console.log('repo');
//    this.user = User;
//    return this;
//};
//
//UserRepo.prototype.data = '';
//
//UserRepo.prototype.getAll = function (next) {
//    this.user.find(function(err, response){
//             console.log('lol');
//             console.log(response);
//            //if (err){res[500](err);return;}
//            this.data = response;
//
//        }).exec(function(err, response){return this;} )
//}
//
//UserRepo.prototype.res = function (next) {
//    console.log('res');
//    res[200](this.data);
//}
