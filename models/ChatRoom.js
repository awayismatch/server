/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('chatRoom', {
    createrUserId: {
        type: Sequelize.INTEGER(11),
        unique:true,
        allowNull:false,
    },
    topic: {
        type: Sequelize.STRING(60),
        allowNull:false,
    },
    genderPlay: {
        type: Sequelize.ENUM('all','plan'),
        allowNull:false,
        defaultValue:'all'
    },
    totalAmount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull:false,
        defaultValue:0
    },
    femaleAmount: {
    type: Sequelize.INTEGER.UNSIGNED,
        allowNull:false,
        defaultValue:0
    },
    maleAmount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull:false,
        defaultValue:0
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

