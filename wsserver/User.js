/**
 * Created by awayisblue on 2017/5/25.
 */
const CrBlockedAttender = require('../models/CrBlockedAttender')
module.exports = User
function User(userId,ws){
    this.id = userId
    this.ws = ws
    this.blockDic = {}
    this.messageCursorDic = {}
}
User.prototype.init = async function(){
   //在这里从数据库获取并初始化屏蔽列表，聊天室的最后一个消息id
}
User.prototype.block = async function(chatRoomId,blockedUserId){
    if(!this.blockDic[chatRoomId]){
        this.blockDic[chatRoomId] = []
    }
    this.blockDic[chatRoomId].push(blockedUserId)
    await CrBlockedAttender.insertOrUpdate({
        chatRoomId,
        blockedUserId,
        userId:this.id,
        block:'open'

    })
}

User.prototype.unBlock = async function(chatRoomId,blockedUserId){
    let list = this.blockDic[chatRoomId]
    if(list){
        let idx = list.indexOf(blockedUserId)
        if(!~idx){
            await CrBlockedAttender.update({
                block:'close',
            },{
                where:{
                    chatRoomId,
                    blockedUserId,
                    userId:this.id
                }
            })
            list.splice(idx,1)
        }
    }
}

User.prototype.send = function(chatRoomId,senderUserId,message){
    if(!this.blockDic[senderUserId]){
        this.ws.send(message)
    }
}

