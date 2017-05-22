/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('feedBack', {
    userId: {
        type: Sequelize.INTEGER(11),
        unique:true,
        allowNull:false,
    },
    content: {
        type: Sequelize.STRING(255),
        allowNull:false,
    }
}, {
    freezeTableName: true,
    tableName: 'feedBacks',
});

