/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('user', {
    email: {
        type: Sequelize.STRING,
        unique:true,
        // field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    password: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

