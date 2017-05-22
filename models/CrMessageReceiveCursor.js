/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('crMessageReceiveCursor', {
    chatRoomId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    latestMessageId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
}, {
    freezeTableName: true,
    tableName: 'crMessageReceiveCursors',
});

