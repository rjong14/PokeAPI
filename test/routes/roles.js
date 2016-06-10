const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

module.exports = (api) => {
    let tempId = '';
    describe('Testing role route', () => {
        describe('without params', () => {
            it('should return all roles', (done) => {
                api.get('/api/roles')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err,res) => {
                        expect(res.body.data).to.not.be.undefined;
                        expect(res.body.data[0]).to.have.property("name");
                        expect(res.body.data[0]).to.have.property("_id");
                        done();
                    })
            });
        });
        describe('role manipulation', () => {
            it('should add a new role',(done) => {
                api.post('/api/roles')
                    .set('Accept', 'application/x-www-form-urlencoded')
                    .send({
                        name:"moot"
                    })
                    .expect(200)
                    .end((err,res) => {
                        expect(res.body.data).to.not.be.undefined;
                        expect(res.body.data).to.have.property("name");
                        expect(res.body.data).to.have.property("_id");
                        tempId = res.body.data._id;
                        done()
                    })
            });
            it('should update an role by id', function (done) {
                api.put('/api/roles/' + tempId)
                    .set('Accept', 'application/x-www-form-urlencoded')
                    .send({
                        name: "poole"
                    })
                    .expect(200)
                    .end((err, res) => {
//                        expect(res.body.data).to.not.be.undefined;
//                        expect(res.body.data).to.have.property("name");
//                        expect(res.body.data).to.have.property("_id");
                        done();
                    });
            });
            it('should delete an user by id', (done) => { // he was an hero
                api.delete('/api/roles/'+tempId)
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
