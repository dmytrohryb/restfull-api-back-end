const prod = require("./prod")
const test = require("./test")

module.exports = {

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