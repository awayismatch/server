

let system = require('./singleSystem')
let CrMessageCursor = require('../../models/CrMessageCursor')
let CrMessage = require('../../models/CrMessage')

module.exports.login = async function(message){
    let {userId} = message
    this.userId = userId
    await system.loginUser(userId,this.ws)
    return 'ok'
}

module.exports.send = async function(message){
    let {chatRoomId} = message
    let chatRoom = system.getChatRoom(chatRoomId)
    let user = chatRoom.getUser(this.userId)
    if(!user){
        throw 'you are no in this chat room'
    }
    let created = await CrMessage.create({
        chatRoomId,
        userId:this.userId,
        text:message.text
    })
    let messageId = created.id
    message.messageId = messageId
    message.userId = created.userId
    message.createdAt = created.createdAt
    //自己发的消息，需要在创建之后就体现在cursor里面
    await user.setMessageCursor(chatRoomId,messageId)
    console.log(chatRoomId,messageId)
    await user.sendToChatRoom(chatRoom,JSON.stringify(message))
    return {status:'ok',messageId,resFor:'send'}
}

module.exports.attend = async function(message){
    let {chatRoomId} = message
    let chatRoom = await system.openChatRoom(chatRoomId)
    if(!chatRoom)throw 'chat room '+chatRoomId+' not exists'
    let user = system.getUser(this.userId)
    await user.enterChatRoom(chatRoom,true)
    return {status:'ok',chatRoomId,resFor:'attend'}
}
module.exports.quit = async function(message){
    let {chatRoomId} = message
    let chatRoom = await system.getChatRoom(chatRoomId)
    if(!chatRoom)throw 'chat room '+chatRoomId+' not exists'
    let user = system.getUser(this.userId)
    await user.leaveChatRoom(chatRoom)
    return {status:'ok',chatRoomId,resFor:'quit'}
}
module.exports.block = async function(message){
    let {userId,chatRoomId} = message
    let user = system.getUser(this.userId)
    await user.blockUser(chatRoomId,userId,true)
    return {status:'ok',chatRoomId,userId,resFor:'block'}
}
module.exports.unblock = async function(message){
    let {userId,chatRoomId} = message
    let user = system.getUser(this.userId)
    await user.unblockUser(chatRoomId,userId,true)
    return {status:'ok',chatRoomId,userId,resFor:'unblock'}
}
module.exports.msgRes = async function(message){
    let {messageId,chatRoomId} = message
    let user = system.getUser(this.userId)
    await user.setMessageCursor(chatRoomId,messageId)
    return false
}
