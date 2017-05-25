/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
const ChatRoom = require('./ChatRoom')
let CrDisplayItem = sequelize.define('crDisplayItem', {
    chatRoomId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        references: {
            model: ChatRoom,
            key:   "id"
        }
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
module.exports = CrDisplayItem

ChatRoom.hasOne(CrDisplayItem)
CrDisplayItem.belongsTo(ChatRoom)