/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('crMessage', {
    chatRoomId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    text: {
        type: Sequelize.STRING(500),
        allowNull:false,
    },
}, {
    freezeTableName: true,
    tableName: 'crMessages',
});

