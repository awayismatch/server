/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
const User = require('./User')
let FeedBack =  sequelize.define('feedBack', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        references: {
            model: User,
            key:   "id"
        }
    },
    content: {
        type: Sequelize.STRING(255),
        allowNull:false,
    }
}, {
    freezeTableName: true,
    tableName: 'feedBacks',
});
module.exports = FeedBack
User.hasMany(FeedBack)
FeedBack.belongsTo(User)
