const {DataTypes} = require('sequelize')

module.exports = sequelize => {

    const attributes = {
        token: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            primaryKey: true
        }
    };

    const options = {
        tableName: "session",
        timestamps: false
    };

    const SessionModel = sequelize.define("session", attributes, options);
    return SessionModel;
};