/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
module.exports =  sequelize.define('profile', {
    userId: {
        type: Sequelize.INTEGER(11),
        unique:true,
        allowNull:false,
    },
    avatar: {
        type: Sequelize.STRING(255),
        allowNull:false,
    },
    gender: {
        type: Sequelize.ENUM('male','female'),
        allowNull:false,
    },
    name: {
        type: Sequelize.STRING(20),
        allowNull:false,
    },
    region: {
        type: Sequelize.STRING(255),
        allowNull:false,
    },
    birthday: {
        type: Sequelize.DATEONLY,
        allowNull:false,
    },
    email: {
        type: Sequelize.STRING(255),
        allowNull:true,
    },
    whatsUp: {
        type: Sequelize.STRING(60),
        allowNull:true,
    }
}, {
    freezeTableName: true,
    tableName: 'profiles',
});

