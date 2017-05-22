/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('passwordResetCode', {
    code: {
        type: Sequelize.STRING(255),
        allowNull:false,
    },
    status: {
        type: Sequelize.ENUM('fresh','used'),
        defaultValue:'fresh',
        allowNull:false,
    },
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull:false,
    },
}, {
    freezeTableName: true,
    tableName: 'passwordResetCodes',
});

