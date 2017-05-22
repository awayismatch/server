/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('blockedUser', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    blockedUserId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
}, {
    freezeTableName: true,
    tableName: 'blockedUsers',
});
