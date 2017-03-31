/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
// const Sequelize = require('sequelize')
module.exports =  sequelize.define('matchs', {

}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

