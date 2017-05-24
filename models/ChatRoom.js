/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('chatRoom', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
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

