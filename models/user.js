const {DataTypes} = require('sequelize')

module.exports = sequelize => {

    const attributes = {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "cannot be null"
                },
                notEmpty: {
                    msg: "cannot be empty"
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: "is not email"
                },
                notNull: {
                    msg: "cannot be null"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [8, 22],
                    msg: "length must be between 8 and 22 characters"
                },
                notNull: {
                    msg: "cannot be null"
                }
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isNumeric: {
                    msg: "must be an numbers"
                }
            }
        }
    };

    const options = {
        tableName: "user",
        timestamps: false
    };

    const UserModel = sequelize.define("user", attributes, options);
    return UserModel;
};