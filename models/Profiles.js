/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('profiles', {
    userId: {
        type: Sequelize.INTEGER(11),
        unique:true,
        allowNull:false,
    },
    avatar: {
        type: Sequelize.STRING(500),
        allowNull:false,
    },
    gender:{
        type:Sequelize.ENUM('男','女'),
        allowNull:false,
    },
    birthday:{
        type:Sequelize.DATE,
        allowNull:false,
    },
    position:{
        type:Sequelize.STRING
    }
}, {
    freezeTableName: true // Model tableName will be the same as the model name
});

