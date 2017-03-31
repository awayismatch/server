/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('matchSubscribers', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    matchId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

