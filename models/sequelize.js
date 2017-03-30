/**
 * Created by awayisblue on 2017/3/18.
 */
const config = require('../config')
const Sequelize = require('sequelize')
module.exports =  new Sequelize('awayismatch', config.mysql.username,config.mysql.password, {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

});