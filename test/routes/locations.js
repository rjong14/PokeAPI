const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

module.exports = (api) => {
    let tempId = '';
    describe('Testing locations route', () => {
        describe('without params', () => {
            it('should return all locations', (done) => {
                api.get('/api/locations')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err,res) => {
                        expect(res.body.data).to.not.be.undefined;
                        expect(res.body.data[0]).to.have.property("latlng");
                        expect(res.body.data[0]).to.have.property("pokeid");
                        done();
                    })
            });
        });
        describe('location manipulation', () => {
            it('should add a new location',(done) => {
                api.post('/api/locations')
                    .set('Accept', 'application/x-www-form-urlencoded')
                    .send({
                        "pokeid": 150,
			            "lat": 5.284993,
			            "lng": 51.684448
                    })
                    .expect(200)
                    .end((err,res) => {
                        expect(res.body.data).to.not.be.undefined;
                        expect(res.body.data).to.have.property("_id");
                        tempId = res.body.data._id;
                        done()
                    })
            });
            it('should get an locations by id', function (done) {
                api.get('/api/locations/' + tempId)
                    .set('Accept', 'application/x-www-form-urlencoded')
                    .expect(200)
                    .end((err, res) => {
                       expect(res.body.data).to.not.be.undefined;
                       expect(res.body.data.pokeid).to.equal(150)
                        done();
                    });
            });
            it('should update an locations by id', function (done) {
                api.put('/api/locations/' + tempId)
                    .set('Accept', 'application/x-www-form-urlencoded')
                    .send({
                        "pokeid": 151,
			            "lat": 5.284993,
			            "lng": 51.684448
                    })
                    .expect(200)
                    .end((err, res) => {
                       expect(res.body.data).to.not.be.undefined;
                       expect(res.body.data.pokeid).to.equal(151)
                        done();
                    });
            });

            it('should delete an location by id', (done) => { // he was an hero
                api.delete('/api/locations/'+tempId)
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
