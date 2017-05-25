/**
 * Created by awayisblue on 2017/5/25.
 */
const CrAttendance = require('../models/CrAttendance')
module.exports = ChatRoom
function ChatRoom(crId){
    this.id = crId
    this.usersDic = {}
}

ChatRoom.prototype.join = async function(user){
    let exists = await CrAttendance.findOne({
        attributes:['id'],
        where:{
            chatRoomId:this.id,
            userId:user.id
        }
    })
    if(!exists){
        await CrAttendance.create({
            chatRoomId:this.id,
            userId:user.id})
    }
    this.usersDic[user.id] = user
}

ChatRoom.prototype.broadcast = function(senderUserId,message){
    for(let key of Object.getOwnPropertyNames(this.usersDic)){
        let user = this.usersDic[key]
        if(senderUserId === user.id)continue
        user.send(senderUserId,message)
    }
}
/**
 * 离开聊天室
 * @param userId
 * @param persist 在数据库里体现，即删除并退出聊天室
 */
ChatRoom.prototype.leave = async function(userId){


    await CrAttendance.destroy({where:{
        chatRoomId:this.id,
        userId
    }})
    delete this.usersDic[userId]
    return 'ok'
}