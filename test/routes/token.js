const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

module.exports = (api) => {
    let token = '';
    describe('token', () => {
        it('should get token', (done) => {
            api.post('/api/token')
                .set('Accept', 'application/x-www-form-urlencoded')
                .send({
                    email: "administrator",
                    password: "administrator"
                })
                .expect(200)
                .end((err, res) => {
                    token = res.body.token;
                console.log(res.body);
                    done();
                })
        });
        it('should get profile', (done) => {
            //console.log(token);
            api.get('/api/profile/')
                .set('Accept', 'application/json')
                .set('token', token)
                .expect(200)
                .end((err, res) => {
                    //console.log(res.body.data);
                    done();
                })
        });
    });

};
