const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

module.exports = (api) => {
    describe('Testing locations route', () => {
        describe('without params', () => {
            it('should return all locations', (done) => {
                api.get('/api/locations')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end((err,res) => {
                        expect(res.body.data).to.not.be.undefined;
                        expect(res.body.data[0]).to.have.property("startLat");
                        expect(res.body.data[0]).to.have.property("pokeid");
                        done();
                    })
            });
        });
        describe('location manipulation', () => {

        });
    });
}
