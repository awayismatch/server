/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
const ChatRoom = require('./ChatRoom')
const User = require('./User')
const Profile = require('./Profile')

let CrAttendance =  sequelize.define('crAttendance', {
    chatRoomId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        unique:'crUser',
        references: {
            model: ChatRoom,
            key:   "id"
        }
    },
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        unique:'crUser',
        references: {
            model: User,
            key:   "id"
        }
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
    tableName: 'crAttendances',
});

module.exports = CrAttendance

ChatRoom.hasMany(CrAttendance)
CrAttendance.belongsTo(ChatRoom)
User.hasMany(CrAttendance)
CrAttendance.belongsTo(User)
