/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')

let User = sequelize.define('user', {
    phone: {
        type: Sequelize.STRING(20),
        unique:true,
        allowNull:false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull:false,
    }
}, {
    freezeTableName: true,
    tableName: 'users',
});

module.exports = User

