/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('pwdResetCodes', {
    email: {
        type: Sequelize.STRING,
        allowNull:false,
        // field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    code: {
        type: Sequelize.STRING,
        allowNull:false,
    },
    activated: {
        type: Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false
    },
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

