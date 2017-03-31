/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('messages', {
    matchId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    type: {
        type: Sequelize.ENUM('text'),
        allowNull:false,
    },
    text:{
        type:Sequelize.TEXT,
    }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

