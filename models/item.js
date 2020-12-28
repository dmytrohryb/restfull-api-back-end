const {DataTypes} = require('sequelize')

module.exports = sequelize => {

    const attributes = {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "is required"
                },
                notNull: {
                    msg: "can't be null"
                }
            }
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: {
                    msg: "can only contain numbers"
                },
                notNull: {
                    msg: "can't be null"
                },
                notEmpty: {
                    msg: "is required"
                }
            }
        },
        image: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "is required"
                }
            }

        },
        created_at: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    };

    const options = {
        tableName: "item",
        timestamps: false
    };

    const ItemModel = sequelize.define("item", attributes, options);
    return ItemModel;
};