process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')
let should = chai.should()

chai.use(chaiHttp)

describe("User", () => {

    describe("/POST register", () => {

        it("it should return 200 status code if user data is correct", (done) => {
            let user = {
                name: "test",
                email: "test@3mail.com",
                password: "password1"
            }

            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property("token")
                    done()
                })
        })

        it("it should return 422 status code if user already exist", (done) => {
            let user = {
                name: "test",
                email: "test@3mail.com",
                password: "password"
            }
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(1)
                    done()
                })
        })

        it("it should return 422 status code if email incorrect", (done) => {
            let user = {
                name: "test",
                email: "testmail.com",
                password: "testtest"
            }
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(1)
                    done()
                })
        })

        it("it should return 422 status code if the password is short", (done) => {
            let user = {
                name: "test name",
                email: "test@email.com",
                password: "adsals"
            }
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(1)
                    done()
                })
        })

        it("it should return 422 status code if the password is long", (done) => {
            let user = {
                name: "test name",
                email: "mailasgasfsf@email.com",
                password: "adsalajspgoagasjpgaskpagpoaspgjapgisapgaiogapokhpgoajghjasposgjapojgiasopgjapgoapnsgp"
            }
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(1)
                    done()
                })
        })

        it("it should return 422 status code if email and password not specified", (done) => {
            let user = {
                name: "test name"
            }
            chai.request(server)
                .post('/register')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(2)
                    done()
                })
        })

    })

    describe("/POST login", () => {

        it("it should return 200 status code if user exist", (done) => {
            let user = {
                email: "test@mail.com",
                password: "12345678"
            }
            chai.request(server)
                .post('/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property("token")
                    done()
                })
        })

        it("it should return 422 status code if user does not exist", (done) => {
            let user = {
                email: "tesgassaggasgsagsat2@mail.com",
                password: "pasfsafasfasfasfassword"
            }
            chai.request(server)
                .post('/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(1)
                    done()
                })
        })

        it("it should return 422 status code if incorrect email and password not specified", (done) => {
            let user = {
                email: "tesgassaggasgsa"
            }
            chai.request(server)
                .post('/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(1)
                    done()
                })
        })

    })

    describe("/GET me", () => {

        it("it should return 200 status code if token exist",(done) => {

            chai.request(server)
                .get('/me')
                .set('authorization', 'test_token')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property("id")
                    res.body.should.have.property("phone")
                    res.body.should.have.property("name")
                    res.body.should.have.property("email")
                    done()
                })
        })

        it("it should return 401 status code if token does not exits", (done) => {
            chai.request(server)
                .get('/me')
                .set('authorization', "fake_token")
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })

        it("it should return 401 status code if token not specified", (done) => {
            chai.request(server)
                .get('/me')
                .end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.be.a('array')
                    res.body.length.should.be.eql(1)
                    done()
                })
        })

    })

})
