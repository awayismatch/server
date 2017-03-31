/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('msgReceivers', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    messageId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    status:{
        type:Sequelize.ENUM('未接收','已接收')
    },
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

