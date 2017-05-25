/**
 * Created by awayisblue on 2017/3/18.
 */
const sequelize = require('./sequelize')
const Sequelize = require('sequelize')
const User = require('./User')
let Report =  sequelize.define('report', {
    userId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
        references: {
            model: User,
            key:   "id"
        }
    },
    reportedUserId: {
        type: Sequelize.INTEGER(11),
        allowNull:false,
    },
    content: {
        type: Sequelize.STRING(255),
        allowNull:false,
    },
}, {
    freezeTableName: true,
    tableName: 'reports',
});

module.exports = Report
Report.belongsTo(User)
User.hasMany(Report)