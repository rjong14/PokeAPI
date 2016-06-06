var request = require('supertest');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should;
var chalk = require('chalk');
var app = require('express')();
var api = request('http://localhost:3000/api');
var tempId = '';

//only for code
function makeRequest(route, statusCode, done){
    api
        .get(route)
        .expect(statusCode)
        .end(function(err, res){
            if(err){ return done(err); }

            done(null, res);
        });
};

describe('Testing user route', function() {
    describe('without params', function () {
        it('should return all users', function (done) {


            makeRequest('/users', 200, function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.data).to.not.be.undefined;
                expect(res.body.message).to.equal('ok')
                done();
            });
        });
    });

    describe('user manipulation', function () {

        it('should add a new user', function(done){
            api.post('/users')
                .set('Accept', 'application/x-www-form-urlencoded')
                .send({
                    email:"unitest",
                    password:"unitest",
                    role:"admin"
                })
                .expect(200)
                .end(function(err,res){
                    expect(res.body.message).to.equal("created")
                    expect(res.body.data.local.email).to.equal("unitest");
                    expect(res.body.data.local.password).to.not.be.undefined;
                    if(!res.body.data._id)
                    console.log(chalk.red('set tempId')); // Not Work, but not work if remove :( HULK SMASH
                    tempId = res.body.data._id;
                    console.log('        tempId : ' + chalk.green(tempId));
                    done()
                })
        });

        it('should get an user by id', function (done) {
            api.get('/users/' + tempId)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
//                console.log('lol');
//                console.log(res.body.data);
                    //expect(res.body.message).to.equal("Ophalen succesvol")
                    expect(res.body.data).to.have.property("role");
                    expect(res.body.data).to.have.property('pokemon');
                    expect(res.body.data.local).to.have.property("email");
                    done();
                })
        });

//        it('should update an employee by id try 2', function (done) {
//            api.put('/employees/' + tempId)
//                .set('Accept', 'application/x-www-form-urlencoded')
//                .send({
//                    name: "Unitest",
//                    username: "unitest"
//                })
//                .expect(200)
//                .end(function (err, res) {
//                    expect(res.body.message).to.equal("Updaten succesvol")
//                    done()
//                });
//        });
//
//        it('should check if employee got updated correctly', function (done) {
//            api.get('/employees/' + tempId)
//                .set('Accept', 'application/json')
//                .expect(200)
//                .end(function (err, res) {
//                    expect(res.body.message).to.equal("Ophalen succesvol")
//                    expect(res.body.data).to.have.property("name");
//                    expect(res.body.data).to.have.property("username");
//                    expect(res.body.data.name).to.equal("Unitest");
//                    expect(res.body.data.username).to.equal("unitest");
//                    done();
//                })
//        });

        it('should delete an user by id', function(done){ // he was an hero
            api.delete('/users/'+tempId)
                .set('Accept', 'application/x-www-form-urlencoded')
                .expect(200)
                .end(function(err,res){
                    expect(res.body.message).to.equal("deleted")
                    done()
                })
         });


});



});
