/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
const User = require('./User')
let ContactRequest = sequelize.define('contactRequest', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        references: {
            model: User,
            key:   "id"
        }
    },
    contactUserId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    remark: {
        type: Sequelize.STRING(20),
        allowNull:true,
    },
    request: {
        type: Sequelize.STRING(60),
        allowNull:true,
    },
    status: {
        type: Sequelize.ENUM('pending','received','reject','accept'),
        allowNull:false,
        defaultValue:'pending'
    },
}, {
    freezeTableName: true,
    tableName: 'contactRequests',
});

module.exports = ContactRequest

User.hasMany(ContactRequest)
ContactRequest.belongsTo(User)