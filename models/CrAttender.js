/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('crAttender', {
    chatRoomId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
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
}, {
    freezeTableName: true,
    tableName: 'crAttenders',
});

