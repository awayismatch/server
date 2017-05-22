/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('contactRequest', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    contactUserId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    remark: {
        type: Sequelize.STRING(20),
        allowNull:true,
    },
    request: {
        type: Sequelize.STRING(60),
        allowNull:true,
    },
    status: {
        type: Sequelize.ENUM('pending','received','reject','accept'),
        allowNull:false,
        defaultValue:'pending'
    },
}, {
    freezeTableName: true,
    tableName: 'contactRequests',
});

