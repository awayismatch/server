/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('contact', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    contactUserId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    remark: {
        type: Sequelize.STRING(20),
        allowNull:true,
    },
}, {
    freezeTableName: true,
    tableName: 'contacts',
});

