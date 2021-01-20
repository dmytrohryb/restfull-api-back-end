const {Sequelize} = require("sequelize")
const env = require("./config/env")

const sequelize = new Sequelize(process.env.NODE_ENV === "test" ? env.testDatabase : env.database, env.user, env.password, {
    dialect: env.dialect,
    port: env.port,
    host: env.host,
    logging: env.getEnv().logging
})

const User = require('./models/user')(sequelize)
const Session = require('./models/session')(sequelize)
const Item = require('./models/item')(sequelize)

User.hasMany(Session, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
})
Session.belongsTo(User)

User.hasMany(Item, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    }
})
Item.belongsTo(User)

async function syncModel ()
{
    await sequelize.sync({ force: false })
}

module.exports = {
    sequelize: sequelize,
    user: User,
    session: Session,
    item: Item,
    sync: syncModel
}