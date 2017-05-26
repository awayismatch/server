

let system = require('../System')
let CrMessageCursor = require('../../models/CrMessageCursor')
let CrMessage = require('../../models/CrMessage')

module.exports.login = async function(message){
    let {userId} = message
    this.userId = userId
    await system.addUser(userId,this.ws)
    return 'login ok'
}

module.exports.send = async function(message){
    let {chatRoomId} = message
    let chatRoom = system.getChatRoom(chatRoomId)
    if(!chatRoom.getUser(this.userId)){
        throw 'you are no in this chat room'
    }
    let created = await CrMessage.create({
        chatRoomId,
        userId:this.userId,
        text:message.text
    })
    message.messageId = created.id
    message.userId = created.userId
    message.createdAt = created.createdAt
    chatRoom.broadcast(this.userId,JSON.stringify(message))
}

module.exports.attend = async function(message){
    let {chatRoomId} = message
    await system.addChatRoom(this.userId,chatRoomId,true)
}

module.exports.msgRes = async function(message){
    let {messageId,chatRoomId} = message
    await CrMessageCursor.insertOrUpdate({
        chatRoomId,
        userId:this.userId,
        crMessageId:messageId
    },{
        where:{chatRoomId,userId:this.userId}
    })
}

module.exports.bulkRes = async function(message){
    let {chatRoomId,largestId} = message
    await CrMessageCursor.insertOrUpdate({
        chatRoomId,
        userId:this.userId,
        crMessageId:largestId
    },{
        where:{chatRoomId,userId:this.userId}
    })
}