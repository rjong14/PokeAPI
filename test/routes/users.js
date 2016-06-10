const chai = require('chai');
const expect = chai.expect;
const should = chai.should;
const chalk = require('chalk');

module.exports = (api) => {
    let tempId = '';
    describe('Testing user route', () => {
        describe('without params', () => {
            it('should return all users', (done) => {
                api.get('/api/users')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err,res) => {
                        expect(res.body.data).to.not.be.undefined;
                        expect(res.body.message).to.equal('ok')
                        done();
                    })
            });
        });

        describe('user manipulation', () => {

            it('should add a new user',(done) => {
                api.post('/api/users')
                    .set('Accept', 'application/x-www-form-urlencoded')
                    .send({
                        email:"unitest",
                        password:"unitest",
                        role:"admin"
                    })
                    .expect(200)
                    .end((err,res) => {
                        expect(res.body.message).to.equal("created")
                        expect(res.body.data.local.email).to.equal("unitest");
                        expect(res.body.data.local.password).to.not.be.undefined;
                        if(!res.body.data._id)
                            console.log(chalk.red('No set tempId'));
                        console.log(chalk.magenta('      set tempId'));
                        tempId = res.body.data._id;
                        console.log(`        tempId :   ${chalk.green(tempId)}`);
                        done()
                    })
            });

            it('should get an user by id', (done) => {
                api.get('/api/users/' + tempId)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err, res) => {
                        //expect(res.body.message).to.equal("Ophalen succesvol")
                        expect(res.body.data).to.have.property("role");
                        expect(res.body.data).to.have.property('pokemon');
                        expect(res.body.data.local).to.have.property("email");
                        done();
                    })
            });

            it('should update an user by id try 2', function (done) {
                api.put('/api/users/' + tempId)
                    .set('Accept', 'application/x-www-form-urlencoded')
                    .send({
                        email: "Unitest"
                    })
                    .expect(200)
                    .end(function (err, res) {
                        expect(res.body.data).to.have.property("role");
                        expect(res.body.data).to.have.property('pokemon');
                        expect(res.body.data.local).to.have.property("email");
                        expect(res.body.data.local.email).to.equal("Unitest");
                        done()
                    });
            });

            it('should delete an user by id', (done) => { // he was an hero
                api.delete('/api/users/'+tempId)
                    .set('Accept', 'application/x-www-form-urlencoded')
                    .expect(200)
                    .end((err,res) => {
                        expect(res.body.message).to.equal("deleted")
                        done();
                    })
             });


        });
    });
}
