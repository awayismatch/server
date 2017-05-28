/**
 * Created by awayisblue on 2017/5/25.
 */
const User = require('./User')
const ChatRoom = require('./ChatRoom')
const ChatRoomModal = require('../../models/ChatRoom')
const CrBlockedAttender = require('../../models/CrBlockedAttender')
const CrAttendance = require('../../models/CrAttendance')

const CrMessageCursor = require('../../models/CrMessageCursor')
module.exports = System
function System(){
    this.chatRoomDic = {}
    this.userDic = {}
}

//更改methods
System.prototype.openChatRoom = async function(chatRoomId){
    if(!this.chatRoomDic[chatRoomId]){
       let exists = await ChatRoomModal.findOne({
           where:{id:chatRoomId}
       })
        if(exists){
           this.chatRoomDic[chatRoomId] = new ChatRoom(chatRoomId)
        }
    }
    return this.chatRoomDic[chatRoomId]
}
System.prototype.loginUser = async function(userId,ws){
    let existUser = this.userDic[userId]
    if(existUser){
        existUser.setWebSocket(ws)
        existUser.enableUser()
    }else{
        this.userDic[userId] = new User(userId,ws)
    }
    let user = this.userDic[userId]
    let blocks = await CrBlockedAttender.findAll({where:{
        userId,
        block:'open'
    }})
    for(let block of blocks){
        await user.blockUser(block.chatRoomId,block.blockedUserId)
    }
    let attendances = await CrAttendance.findAll({
        where: {userId,status:'attend'},
        order:[
            ['id','desc']
        ]
    })
    for(let attendance of attendances){
        let chatRoomId = attendance.chatRoomId
        let chatRoom = await this.openChatRoom(chatRoomId)
        let cursor = await CrMessageCursor.findOne({
            where:{chatRoomId,userId}
        })
        let messageId = cursor?cursor.crMessageId:0
        //由于messagecursor是在用户退出之后才保存到数据库，所以数据库里的可能不是最新的。
        let inMemoryMessageId = user.getMessageCursor(chatRoomId)
        messageId>inMemoryMessageId && user.setMessageCursor(chatRoomId,messageId)

        await user.enterChatRoom(chatRoom)
    }

    return user
}

System.prototype.logoutUser = function(userId){
    let existUser = this.userDic[userId]
    if(existUser){
        existUser.disableUser()
        existUser.setReady(false)
    }
    return existUser
}

System.prototype.getUser = function(userId){
    let existUser = this.userDic[userId]
    if(existUser && existUser.isUsable())return existUser

    return false
}

System.prototype.getChatRoom = function(chatRoomId){
    return this.chatRoomDic[chatRoomId]
}
