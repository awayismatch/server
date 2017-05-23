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
    block: {
        type: Sequelize.ENUM('open','close'),
        allowNull:false,
        defaultValue:'open'
    },
}, {
    freezeTableName: true,
    tableName: 'blockedUsers',
});

