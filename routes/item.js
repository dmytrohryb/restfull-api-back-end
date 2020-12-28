let fs = require('fs')

module.exports = function (app, db){

    app.get("/items", (req, res) => {
        db.item.findAll({
            include: {
                model: db.user
            }
        })
            .then(items => {
                let data = []
                items.forEach(item => {
                    data.push({
                        id: item.id,
                        created_at: item.created_at,
                        title: item.title,
                        price: item.price,
                        image: item.image,
                        user_id: item.userId,
                        user: {
                            id: item.user.id,
                            name: item.user.name,
                            email: item.user.email,
                            phone: item.user.phone
                        }
                    })
                })
                res.status(200).send(data)
            })
            .catch(err => {
                console.error(err.message)
                res.status(500).send()
            })
    })

    app.get("/items/:id", (req, res) => {
        db.item.findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: db.user
            }
        })
            .then(item => {
                if(item)
                {
                    res.status(200).send({
                        id: item.id,
                        created_at: item.created_at,
                        title: item.title,
                        price: item.price,
                        image: item.image,
                        user_id: item.userId,
                        user: {
                            id: item.user.id,
                            name: item.user.name,
                            email: item.user.email,
                            phone: item.user.phone
                        }
                    })
                }
                else
                {
                    res.status(404).send()
                }
            })
            .catch(err => {
                console.log(err.message)
                res.status(500).send()
            })
    })

    app.post("/items", (req, res) => {

        if(req.headers.authorization !== undefined)
        {
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
                        db.item.create({
                            title: req.body.title,
                            price: req.body.price,
                            created_at: new Date().getTime() / 1000,
                            userId: user.user.id
                        })
                            .then(item => {
                                res.status(200).send({
                                    id: item.id,
                                    created_at: item.created_at,
                                    title: item.title,
                                    price: item.price,
                                    image: item.image,
                                    user_id: item.userId,
                                    user: {
                                        id: user.user.id,
                                        name: user.user.name,
                                        email: user.user.email,
                                        phone: user.user.phone
                                    }
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
                    }
                    else
                    {
                        res.status(401).send()
                    }
                })
                .catch(err => {
                    console.error(err.message)
                    res.status(500).send()
                })
        }
        else
        {
            res.status(422).send([
                {
                    field: "authorization",
                    message: "token not specified"
                }
            ])
        }
    })

    app.put("/items/:id", (req, res) => {
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
                    db.item.findOne({
                        where: {
                            id: req.params.id
                        }
                    })
                        .then(item => {
                            if(item.userId === user.user.id)
                            {
                                if(req.body.title !== undefined || req.body.price !== undefined)
                                {
                                    db.item.update(req.body, {
                                        where: {
                                            id: req.params.id
                                        }
                                    })
                                        .then(() => {
                                            db.item.findOne({where: {id: req.params.id}})
                                                .then(item => {
                                                    res.status(200).send({
                                                        id: item.id,
                                                        created_at: item.created_at,
                                                        title: item.title,
                                                        price: item.price,
                                                        image: item.image,
                                                        user_id: item.userId,
                                                        user: {
                                                            id: user.user.id,
                                                            name: user.user.name,
                                                            email: user.user.email,
                                                            phone: user.user.phone
                                                        }
                                                    })
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
                                }else
                                {
                                    res.status(422).send([
                                        {
                                            field: "price and title",
                                            field: "required price or title"
                                        }
                                    ])
                                }

                            }
                            else
                            {
                                res.status(403).send()
                            }
                        })
                        .catch(err => {
                            res.status(404).send()
                        })
                }
                else
                {
                    res.status(401).send()
                }
            })
            .catch(err => {
                console.error(err.message)
                res.status(500).send()
            })
    })

    app.delete("/items/:id", (req, res) => {
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
                    db.item.findOne({
                        where: {
                            id: req.params.id
                        }
                    })
                        .then(item => {
                            if(item.userId === user.user.id)
                            {
                                db.item.destroy({
                                    where: {
                                        id: req.params.id
                                    }
                                })
                                    .then(() => {
                                        res.status(200).send()
                                    })
                                    .catch(err => {
                                        console.error(err.message)
                                        res.status(500).send()
                                    })
                            }
                            else
                            {
                                res.status(403).send()
                            }
                        })
                        .catch(err => {
                            res.status(404).send()
                        })
                }
                else
                {
                    res.status(401).send()
                }
            })
            .catch(err => {
                console.error(err.message)
                res.status(500).send()
            })
    })

    app.post("/items/:id/images", (req, res) => {
        if(req.headers.authorization !== undefined)
        {
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
                        db.item.findOne({
                            where: {
                                id: req.params.id
                            }
                        })
                            .then(item => {
                                if(item.userId === user.user.id)
                                {
                                    db.item.update({image: 'uploads/' + req.file.originalname}, {
                                        where: {
                                            id: req.params.id
                                        }
                                    })
                                        .then(() => {
                                            fs.rename(req.file.path, 'uploads/' + req.file.originalname, (err) => {
                                                if (err) throw err
                                                db.item.findOne({where: {id: req.params.id}})
                                                    .then(updatedItem => {
                                                        res.status(200).send({
                                                            id: updatedItem.id,
                                                            created_at: updatedItem.created_at,
                                                            title: updatedItem.title,
                                                            price: updatedItem.price,
                                                            image: updatedItem.image,
                                                            user_id: updatedItem.userId,
                                                            user: {
                                                                id: user.user.id,
                                                                name: user.user.name,
                                                                email: user.user.email,
                                                                phone: user.user.phone
                                                            }
                                                        })
                                                    })
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
                                }
                                else
                                {
                                    res.status(403).send()
                                }
                            })
                            .catch(err => {
                                console.error(err.message)
                                res.status(404).send()
                            })
                    }
                    else
                    {
                        res.status(401).send()
                    }
                })
                .catch(err => {
                    console.error(err.message)
                    res.status(500).send()
                })
        }
        else
        {
            res.status(422).send([
                {
                    field: "authorization",
                    message: "token not specified"
                }
            ])
        }

    })
}

