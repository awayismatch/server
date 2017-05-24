/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
const User = require('./User')
let BlockedUser =  sequelize.define('blockedUser', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        references: {
            model: User,
            key:   "id"
        }
    },
    blockedUserId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    block: {
        type: Sequelize.ENUM('open','close'),
        allowNull:false,
        defaultValue:'open'
    },
}, {
    freezeTableName: true,
    tableName: 'blockedUsers',
});
module.exports = BlockedUser


User.hasMany(BlockedUser)
BlockedUser.belongsTo(User)