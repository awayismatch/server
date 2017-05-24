/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
const User = require('./User')
let Contact = sequelize.define('contact', {
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
}, {
    freezeTableName: true,
    tableName: 'contacts',
});

module.exports = Contact

User.hasMany(Contact)
Contact.belongsTo(User)