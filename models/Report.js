/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('report', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    reportedUserId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    content: {
        type: Sequelize.STRING(255),
        allowNull:false,
    },
}, {
    freezeTableName: true,
    tableName: 'reports',
});

