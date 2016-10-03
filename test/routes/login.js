const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

module.exports = (api) => {
describe('Login', () => {
    it('should login', (done) => {
        api.post('/login')
            .set('Accept', 'application/x-www-form-urlencoded')
            .send({
                email: "administrator",
                password: "administrator"
            })
            .expect(200)
            .end((err, res) => {
                done();
            })
    });
    it('get profile', (done) => {
            api.get('/api/profile/')
                .set('Accept', 'application/json')
                .expect(200)
                .end((err, res) => {
                    console.log(res.body.data);
                    done();
                })
    });
});

};
