/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
const User = require('./User')
let ChatRoom = sequelize.define('chatRoom', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        references: {
            model: User,
            key:   "id"
        }
    },
    topic: {
        type: Sequelize.STRING(60),
        allowNull:false,
    },
    genderPlan: {
        type: Sequelize.ENUM('all','plan'),
        allowNull:false,
        defaultValue:'all'
    },
    totalAmount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull:false,
    },
    femaleAmount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull:true,
    },
    maleAmount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull:true,
    },
    roomType: {
        type: Sequelize.ENUM('public','private','friend'),
        allowNull:false,
        defaultValue:'public'
    },
}, {
    freezeTableName: true,
    tableName: 'chatRooms',
});

module.exports = ChatRoom
User.hasMany(ChatRoom)
ChatRoom.belongsTo(User)