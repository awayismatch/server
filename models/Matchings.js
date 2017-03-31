/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('matchings', {
    userId: {
        type: Sequelize.INTEGER(11),
        unique:true,
        allowNull:false,
    },
    gender:{
        type:Sequelize.ENUM('男','女'),
    },
    birthday:{
        type:Sequelize.DATE,
    },
    minAge:{
        type:Sequelize.STRING(4)
    },
    maxAge:{
        type:Sequelize.STRING(4)
    }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

