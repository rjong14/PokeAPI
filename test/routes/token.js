const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

module.exports = (api) => {
    let token = '';
    describe('token', () => {
        it('should get token android', (done) => {
            api.post('/api/token')
                .set('Accept', 'application/x-www-form-urlencoded')
                .set('isandroid', 'true')
                .send({
                    email: "administrator",
                    password: "administrator"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.token).to.not.be.undefined;
                    token = res.body.token;
                    done();
                })
        });
//            it('put user android', function (done) {
//                api.put('/api/users/' + "5750470d91de88605bad1b54")
//                    //.set('Accept', 'application/x-www-form-urlencoded')
//                    //.set('token', token)
//                    .send({
//                        email: "rick",
//                        password: 'rick'
//                    })
//                    .expect(200)
//                    .end((err, res) => {
//                        expect(res.body.data).to.have.property("role");
//                        expect(res.body.data).to.have.property('pokemon');
//                        expect(res.body.data.local).to.have.property("email");
//                        expect(res.body.data.local.email).to.equal("rick");
//                        done();
//                    });
//            });
        it('should get token', (done) => {
            api.post('/api/token')
                .set('Accept', 'application/x-www-form-urlencoded')
                .send({
                    email: "administrator",
                    password: "administrator"
                })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.data.token).to.not.be.undefined;
                    token = res.body.data.token;
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
