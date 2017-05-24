/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
const Contact = require('./Contact')
const ContactRequest = require('./ContactRequest')
const Profile = require('./Profile')
const Profile = require('./Report')
const Profile = require('./FeedBack')
const Profile = require('./BlockedUser')
const Profile = require('./CrBrowseHistory')
module.exports =  sequelize.define('user', {
    phone: {
        type: Sequelize.STRING(20),
        unique:true,
        allowNull:false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull:false,
    }
}, {
    freezeTableName: true,
    tableName: 'users',
});

