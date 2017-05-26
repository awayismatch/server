/**
 * Created by awayisblue on 2017/5/26.
 */
const system = require('./singleSystem')
module.exports.checkLogin = async function(){
    let systemUser = system.getUser(this.userId)
    if(systemUser &&systemUser.isUsable())return 'ok'
    throw 'unAuthorize'
}