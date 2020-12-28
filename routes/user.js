const TokenGenerator = require('uuid-token-generator')
const tokgen = new TokenGenerator(256, TokenGenerator.BASE62)

module.exports = function (app, db) {

    app.post("/login", (req, res) => {
        db.user.findOne({
            where: {
                email: req.body.email,
                password: req.body.password
            }
        })
            .then(user => {
                if(user)
                {
                    db.session.create({
                        token: tokgen.generate(),
                        userId: user.id
                    })
                        .then(session => {
                            res.status(200).send({token: session.token})
                        })
                        .catch(err => {
                            console.error(err.message)
                            res.status(500).send()
                        })
                }
                else
                {
                    res.status(422).send([{
                        field: "email or password",
                        message: "wrong email or password"
                    }])
                }

            })
            .catch(err => {
                if(req.body.password === undefined || req.body.email === undefined)
                {
                    res.status(422).send([{
                        field: "email and password",
                        message: "required"
                    }])
                }
                else{
                    console.log(err.message)
                    res.status(500).send()
                }
            })
    })

    app.post("/register", (req, res) => {
        db.user.create({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            phone: req.body.phone
        })
            .then(user => {
                db.session.create({
                    token: tokgen.generate(),
                    userId: user.id
                })
                    .then(session => {
                        res.status(200).send({token: session.token})
                    })
                    .catch(err => {
                        console.error(err.message)
                        res.status(500).send()
                    })
            })
            .catch(err => {
                let responseErrors = []
                err.errors.forEach(error => {
                    responseErrors.push({
                        field: error.path,
                        message: error.message
                    })
                })
                res.status(422).send(responseErrors)
            })
    })

    app.get("/me", (req, res) => {

        db.session.findOne({
            where: {
                token: req.headers.authorization
            },
            include: {
                model: db.user
            }
        })
            .then(user => {
                if(user)
                {
                    res.status(200).send({
                        id: user.user.id,
                        name: user.user.name,
                        email: user.user.email,
                        phone: user.user.phone
                    })
                }
                else
                {
                    res.status(401).send()
                }
            })
            .catch(err => {
                if(req.headers.authorization === undefined)
                {
                    res.status(422).send([{
                        field: "token",
                        message: "required"
                    }])
                }
                else{
                    console.log(err.message)
                    res.status(500).send()
                }
            })
    })
}