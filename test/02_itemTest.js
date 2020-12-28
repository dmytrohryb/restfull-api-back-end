process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')
let should = chai.should()

chai.use(chaiHttp)

describe('Items', () => {

    describe('/GET items', () => {

        it('it should return 200 status code', (done) => {
            chai.request(server)
                .get('/items')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("array")
                    done()
                })
        })

    })

    describe('/GET items/:id', () => {

        it('it should return 200 status code if item exists', (done) => {
            chai.request(server)
                .get('/items/' + 1)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    done()
                })
        })

        it('it should return 404 status code if item does not exists', (done) => {
            chai.request(server)
                .get('/items/' + 10)
                .end((err, res) => {
                    res.should.have.status(404)
                    done()
                })
        })

    })

    describe('/POST items', () => {

        it("it should return 422 status code if token not specified", (done) => {
            let item = {
                title: "test",
                price: 200,
                created_at: new Date().getTime() / 1000,
                userId: 1
            }

            chai.request(server)
                .post('/items')
                .send(item)
                .end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.be.a('array')
                    done()
                })
        })

        it("it should return 200 status code if token specified and item data is correct", (done) => {
            let item = {
                title: "test",
                price: 200,
                created_at: new Date().getTime() / 1000,
                userId: 1
            }

            chai.request(server)
                .post('/items')
                .set({authorization: "test_token"})
                .send(item)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    done()
                })
        })

        it("it should return 401 status code if user unauthorized", (done) => {
            let item = {
                title: "tesst",
                price: 200,
                created_at: new Date().getTime() / 1000,
                userId: 1
            }

            chai.request(server)
                .post('/items')
                .set({authorization: "fake_token"})
                .send(item)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })

    })

    describe('/PUT items/:id', () => {

        it('it should return 200 status code if price is correct', (done) => {
            let itemData = {
                price: 244
            }
            chai.request(server)
                .put('/items/' + 1)
                .set("authorization", "test_token")
                .send(itemData)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    done()
                })
        })

        it('it should return 200 status code if price and title is correct', (done) => {
            let itemData = {
                price: 244,
                title: "new Title"
            }
            chai.request(server)
                .put('/items/' + 1)
                .set("authorization", "test_token")
                .send(itemData)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    done()
                })
        })

        it('it should return 200 status code if title is correct', (done) => {
            let itemData = {
                title: "new Title"
            }
            chai.request(server)
                .put('/items/' + 1)
                .set("authorization", "test_token")
                .send(itemData)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    done()
                })
        })

        it('it should return 422 status code if no parameter is specified', (done) => {
            let itemData = {}
            chai.request(server)
                .put('/items/' + 1)
                .set("authorization", "test_token")

                .end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.be.a("array")
                    done()
                })
        })

        it('it should return 404 status code if item does not exist', (done) => {
            let itemData = {}
            chai.request(server)
                .put('/items/' + 10)
                .set("authorization", "test_token")

                .end((err, res) => {
                    res.should.have.status(404)
                    done()
                })
        })

        it('it should return 403 status code if creator and current user do not match', (done) => {

            chai.request(server)
                .put('/items/' + 3)
                .set("authorization", "test_token")
                .end((err, res) => {
                    res.should.have.status(403)
                    done()
                })
        })

        it('it should return 422 status code if incorrect price', (done) => {
            let itemData = {
                price: "fasasf"
            }
            chai.request(server)
                .put('/items/' + 1)
                .set("authorization", "test_token")

                .end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.be.a("array")
                    done()
                })
        })

        it('it should return 401 status code if user unauthorized', (done) => {
            let itemData = {
                title: "new Title"
            }
            chai.request(server)
                .put('/items/' + 1)
                .set("authorization", "24")
                .send(itemData)
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })
    })

    describe('/DELETE items/:id', () => {

        it('it should return 403 status code if creator and current user do not match', (done) => {
            let itemData = {}
            chai.request(server)
                .put('/items/' + 3)
                .set("authorization", "test_token")

                .end((err, res) => {
                    res.should.have.status(403)
                    done()
                })
        })

        it('it should return 401 status code if user unauthorized', (done) => {
            chai.request(server)
                .delete('/items/' + 1)
                .set("authorization", "sfa")
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })

        it('it should return 200 status code if item exists', (done) => {
            chai.request(server)
                .delete('/items/' + 1)
                .set("authorization", "test_token")
                .end((err, res) => {
                    res.should.have.status(200)
                    done()
                })
        })

        it('it should return 404 status code if item does not exist', (done) => {
            chai.request(server)
                .delete('/items/' + 1)
                .set("authorization", "test_token")
                .end((err, res) => {
                    res.should.have.status(404)
                    done()
                })
        })

    })

    describe('/POST items/:id/images', () => {

        it("it should return 200 status code", (done) => {
            chai.request(server)
                .post('/items/4/images')
                .attach('image', './test/image.jpg', 'image.jpg')
                .set({authorization: "test_token"})
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    done()
                })
        })

        it("it should return 403 status code if creator and current user do not match", (done) => {
            chai.request(server)
                .post('/items/3/images')
                .attach('image', './test/image.jpg', 'image.jpg')
                .set({authorization: "test_token"})
                .end((err, res) => {
                    res.should.have.status(403)
                    done()
                })
        })

        it("it should return 422 status code if token not specified", (done) => {
            chai.request(server)
                .post('/items/3/images')
                .attach('image', './test/image.jpg', 'image.jpg')
                .end((err, res) => {
                    res.should.have.status(422)
                    done()
                })
        })

        it("it should return 401 status code if user unauthorized", (done) => {
            chai.request(server)
                .post('/items/3/images')
                .attach('image', './test/image.jpg', 'image.jpg')
                .set({authorization: "fake_token"})
                .end((err, res) => {
                    res.should.have.status(401)
                    done()
                })
        })

    })

})