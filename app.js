const express = require('express')
const app = express()
process.env.PORT = 4000
const db = require('./db')
const body_parser = require('body-parser')
let multer = require('multer')
let upload = multer({ dest: 'uploads/' })

db.sync()
    .then(() => {
        if(process.env.NODE_ENV !== 'test')
            console.log("successfully synchronized model")
    })
    .catch(err => {
        console.error(err.message)
    })

app.use(body_parser.urlencoded({ extended: true }))
app.use(body_parser.json())
app.use(upload.single("image"))

require("./routes/user")(app, db)
require("./routes/item")(app, db)

app.listen(process.env.PORT, () => {
    console.log(`App listening at http://localhost: ${process.env.PORT}`)
})

module.exports = app