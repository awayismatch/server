/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('crBrowseHistory', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    fromChatRoomId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    toChatRoomId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
}, {
    freezeTableName: true,
    tableName: 'crBrowseHistorys',
});

