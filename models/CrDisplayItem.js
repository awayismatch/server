/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('crDisplayItem', {
    chatRoomId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    priority: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull:false,
        defaultValue:0
    },

}, {
    freezeTableName: true,
    tableName: 'crDisplayItems',
});

