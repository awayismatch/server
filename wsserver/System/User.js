/**
 * Created by awayisblue on 2017/5/25.
 */
const CrBlockedAttender = require('../../models/CrBlockedAttender')
const CrAttendance = require('../../models/CrAttendance')
const CrMessage = require('../../models/CrMessage')
const CrMessageCursor = require('../../models/CrMessageCursor')
module.exports = User
function User(userId,ws){
    this.id = userId
    this.ws = ws
    this.blockDic = {}

    this.messageCursorDic = {}
    this.enable = true
}

//更改methods
/**
 * 进入聊天室时，系统会把末接受的消息全部发送给加入的人
 * @param chatRoom
 * @param persist
 * @returns {Promise.<void>}
 */
User.prototype.enterChatRoom = async function(chatRoom,persist = false){
    let chatRoomId = chatRoom.id
    let userId = this.id
    chatRoom.addUser(this)
    if(persist){
        let exists = await CrAttendance.findOne({
            attributes:['id'],
            where:{
                chatRoomId,
                userId,
                status:'attend'
            }
        })
        if(!exists){
            await CrAttendance.insertOrUpdate({
                chatRoomId,
                userId,
                status:'attend'
            })
            let lastMessage = await CrMessage.findOne({
                attributes:['id'],
                where:{chatRoomId},
                order:[
                    ['id','desc']
                ]
            })
            let crMessageId = lastMessage?lastMessage.id:0
            await CrMessageCursor.insertOrUpdate({
                chatRoomId,
                userId,
                crMessageId
            })

        }
    }
    let lastMessage = await CrMessageCursor.findOne({
        attributes:['crMessageId'],
        where:{chatRoomId,userId},
        order:[
            ['id','desc']
        ]
    })
    let messageId = lastMessage?lastMessage.crMessageId:0
    this.messageCursorDic[chatRoomId] = messageId
    let notSentMessages = await CrMessage.findAll({
        attributes:['userId','id','text','createdAt'],
        where:{
            chatRoomId,
            id:{
                $gt:messageId,
            }
        },
        order:[
            ['id','asc'],
        ]
    })
    for(let message of notSentMessages){
        let {userId,id,text,createdAt} = message
        let res = {action:'send',messageId:id,chatRoomId,userId,text,createdAt}
        this.ws.send(JSON.stringify(res))
    }
}
User.prototype.setMessageCursor = function(chatRoomId,messageId){
    this.messageCursorDic[chatRoomId] = messageId
}

User.prototype.getMessageCursor = function(chatRoomId){
    return this.messageCursorDic[chatRoomId]
}


User.prototype.leaveChatRoom = async function(chatRoom){
    //在这里从数据库获取并初始化屏蔽列表

}

User.prototype.setWebSocket = function(ws){
    this.ws = ws
}
User.prototype.enableUser = function(){
    this.enable = true
}
User.prototype.disableUser = function(){
    this.enable = false
}
User.prototype.isUsable = function(){
    return this.enable
}

User.prototype.isInChatRoom = async function(chatRoom){
    let user = chatRoom.getUser(this.userId)
    return  user&&user.isUsable()
}

User.prototype.sendToChatRoom = async function(chatRoom,message){

    let userDic = chatRoom.getAllUsers()
    for(let key of Object.getOwnPropertyNames(userDic)){
        let user = userDic[key]
        if(this.id === user.id)continue
        console.log(user.isUsable(),user.enable)
        user.isUsable()&&user.ws.send(message)
    }
}


User.prototype.blockUser = async function(chatRoomId,blockedUserId){
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

User.prototype.unBlockUser = async function(chatRoomId,blockedUserId){
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

User.prototype.getAllMessageCursors = function(){
    return this.messageCursorDic
}
