/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('crAttender', {
    chatRoomId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        unique:'crUser'
    },
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        unique:'crUser'
    },
    status: {
        type: Sequelize.ENUM('attend','quit'),
        allowNull:false,
        defaultValue:'attend'
    },
    doNotDisturb: {
        type: Sequelize.ENUM('open','close'),
        allowNull:false,
        defaultValue:'close'
    },
    saveChatRoom: {
        type: Sequelize.ENUM('open','close'),
        allowNull:false,
        defaultValue:'close'
    },
    //用于记录最后一接收到的一条消息id.
    latestMessageId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        defaultValue:0,
    },
}, {
    freezeTableName: true,
    tableName: 'crAttenders',
});

