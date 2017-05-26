/**
 * Created by awayisblue on 2017/5/25.
 */
const User = require('./User')
const ChatRoom = require('./ChatRoom')
const CrAttendanceModel = require('../../models/CrAttendance')
module.exports = System
function System(){
    this.chatRoomDic = {}
    this.userDic = {}
}

System.prototype.addChatRoom = async function(userId,chatRoomId,check){
    if(!this.userDic[userId])throw 'plz login user first!'
    if(!this.chatRoomDic[chatRoomId]){
        this.chatRoomDic[chatRoomId] = new ChatRoom(chatRoomId)
    }
    await this.chatRoomDic[chatRoomId].addUser(this.userDic[userId],check)
}

System.prototype.addUser = async function(userId,ws){
    if (!this.userDic[userId]) {
        let user = this.userDic[userId] = new User(userId, ws)
        await user.init()
    } else {
        this.userDic[userId].setWs(ws)
    }
    this.userDic[userId].login()
    let attendances = await CrAttendanceModel.findAll({where:{userId,status:'attend'}})
    for(let attendance of attendances){
       await this.addChatRoom(userId,attendance.chatRoomId)
    }
}

System.prototype.removeUser = function(userId){
    this.userDic[userId]&&this.userDic[userId].logout()

}

System.prototype.getUser = function(userId){
    if(this.userDic[userId] && this.userDic[userId].isLogin())
    return this.userDic[userId]
    return false
}

System.prototype.getChatRoom = function(chatRoomId){
    return this.chatRoomDic[chatRoomId]
}