/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('contacts', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    contactUserId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    remark:{
        type:Sequelize.STRING(30)
    },
    note:{
        type:Sequelize.STRING
    },
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

