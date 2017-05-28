/**
 * Created by awayisblue on 2017/5/25.
 */
const CrBlockedAttender = require('../../models/CrBlockedAttender')
const CrAttendance = require('../../models/CrAttendance')
const CrMessage = require('../../models/CrMessage')
const CrMessageCursor = require('../../models/CrMessageCursor')
const sequelize = require('../../models/sequelize')
module.exports = User
function User(userId,ws){
    this.id = userId
    this.ws = ws
    this.blockDic = {}
    this.enable = true

    //when user is created( not ready), user will fetch message from database, while fetching,
    //message receive from webSocket will be pushed to messageQueue
    this.ready = false
    this.messageQueue = []
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
            let transaction = await sequelize.transaction()
            try{
                await CrAttendance.create({
                    chatRoomId,
                    userId,
                    status:'attend'
                },{transaction:transaction})
                let lastMessage = await CrMessage.findOne({
                    attributes:['id'],
                    where:{chatRoomId},
                    order:[
                        ['id','desc']
                    ]
                })
                let crMessageId = lastMessage?lastMessage.id:0
                await CrMessageCursor.create({
                    chatRoomId,
                    userId,
                    crMessageId
                },{transaction:transaction})
                await transaction.commit()
            }catch (err){
                await transaction.rollback()
                throw err
            }
        }
    }
    await this.flushDbMessages(chatRoomId)
    this.setReady(true)
}
User.prototype.flushDbMessages = async function(chatRoomId){
    let messageId = await this.getMessageCursor(chatRoomId)
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
User.prototype.leaveChatRoom = async function(chatRoom){

    let chatRoomId = chatRoom.id
    let userId = this.id
    chatRoom.removeUser(this)
    await CrAttendance.update({
        status:"quit",
    },{where:{chatRoomId,userId}})
}
User.prototype.setMessageCursor = async function(chatRoomId,messageId){

    await CrMessageCursor.insertOrUpdate({
        chatRoomId,
        userId:this.id,
        crMessageId:messageId
    })

}

User.prototype.getMessageCursor = async function(chatRoomId){
    let cursor = await CrMessageCursor.findOne({
        attributes:['crMessageId'],
        where:{
            chatRoomId,
            userId:this.id,
        },
        order:[
            ['id','desc']
        ]
    })
    return cursor?cursor.crMessageId:0
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

User.prototype.setReady = function(isReady){
    if(isReady){
        while(this.messageQueue.length){
            this.ws.send(this.messageQueue.shift())
        }
    }
    this.ready = isReady
}
User.prototype.isReady = function(){
    return this.ready
}
User.prototype.queueMessage = function(message){
    return this.messageQueue.push(message)
}

User.prototype.sendToChatRoom = async function(chatRoom,message){

    let userDic = chatRoom.getAllUsers()
    for(let key of Object.getOwnPropertyNames(userDic)){
        let user = userDic[key]

        if(this.id === user.id)continue
        if(user.isUsable()&&!user.doIBlock(chatRoom.id,this.id)){
            if(user.isReady())user.ws.send(message)
            else user.queueMessage(message)
        }
    }
}


User.prototype.blockUser = async function(chatRoomId,blockedUserId,persist = false){
    console.log(this.id,'block',blockedUserId)
    if(!this.blockDic[chatRoomId]){
        this.blockDic[chatRoomId] = {}
    }
    this.blockDic[chatRoomId][blockedUserId] = true
    if(persist){
        await CrBlockedAttender.insertOrUpdate({
            chatRoomId,
            blockedUserId,
            userId:this.id,
            block:'open'
        })
    }

}

User.prototype.unblockUser = async function(chatRoomId,blockedUserId,persist=false){
    delete this.blockDic[chatRoomId][blockedUserId]
    if(persist){
        await CrBlockedAttender.update({
            block:'close',
        },{
            where:{
                chatRoomId,
                blockedUserId,
                userId:this.id
            }
        })
    }
}


User.prototype.doIBlock = function(chatRoomId,blockedUserId){
    return this.blockDic[chatRoomId]&&this.blockDic[chatRoomId][blockedUserId]
}

