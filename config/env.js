const prod = require("./prod")
const test = require("./test")

module.exports = {
    database: "data",
    testDatabase: "testData",
    host: "localhost",
    dialect: "mysql",
    port: 3306,
    user: "root",
    password: "658932147",
    getEnv: function () {
        switch (process.env.NODE_ENV)
        {
            case "test":
                return test
            default:
                return prod
        }
    }

}