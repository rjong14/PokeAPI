const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

module.exports = (api) => {
    describe('Testing frontend route', () => {
    it('should goto dash', (done) => {
        api.get('/')
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect(200)
            .end((err, res) => {
                done();
            })
    });
    it('should goto users', (done) => {
        api.get('/users')
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect(200)
            .end((err, res) => {
                done();
            })
    });
    it('should goto locations', (done) => {
        api.get('/locations')
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect(200)
            .end((err, res) => {
                done();
            })
    });
    it('should goto login', (done) => {
        api.get('/login')
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect(200)
            .end((err, res) => {
                done();
            })
    });
    it('should goto logout', (done) => {
        api.get('/logout')
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect(200)
            .end((err, res) => {
                done();
            })
    });
    it('should goto auth facebook', (done) => {
        api.get('/auth/facebook')
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect(200)
            .end((err, res) => {
                done();
            })
    });
    it('should goto callback facebook', (done) => {
        api.get('/auth/facebook/callback')
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect(200)
            .end((err, res) => {
                done();
            })
    });
    it('should goto auth google', (done) => {
        api.get('/auth/google')
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect(200)
            .end((err, res) => {
                done();
            })
    });
    it('should goto google callback', (done) => {
        api.get('/auth/google/callback')
            .set('Accept', 'application/x-www-form-urlencoded')
            .expect(200)
            .end((err, res) => {
                done();
            })
    });
});
}
