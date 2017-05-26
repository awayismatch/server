/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('crMessageCursor', {
    chatRoomId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        unique:'composite',
    },
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        unique:'composite',
    },
    crMessageId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
}, {
    freezeTableName: true,
    tableName: 'crMessageCursors',
});

