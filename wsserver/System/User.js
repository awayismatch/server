/**
 * Created by awayisblue on 2017/5/25.
 */
const CrBlockedAttender = require('../../models/CrBlockedAttender')
module.exports = User
function User(userId,ws){
    this.id = userId
    this.ws = ws
    this.blockDic = {}
    /**
     * chatRoomDic[chatRoomId] = {messageCursor:'',messageQueue:[],isReady:true}
     * @type {{}}
     */
    this.chatRoomDic = {}
    this.state = 'login'
}
User.prototype.init = async function(){
   //在这里从数据库获取并初始化屏蔽列表
    let blocks = await CrBlockedAttender.findAll({where:{
        userId:this.id,
        block:'open'
    }})
    for(let block of blocks){
        await this.block(block.chatRoomId,block.blockedUserId)
    }
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

User.prototype.joinChatRoom = function(chatRoomId){
    this.ws.send(this.id+' join '+chatRoomId)
    this.chatRoomDic[chatRoomId] || (this.chatRoomDic[chatRoomId] = {isReady:false,messageQueue:[]})
    this.ws.send(JSON.stringify(this.chatRoomDic[chatRoomId]))
}

User.prototype.send = function(chatRoomId,senderUserId,message){
    if(this.state=='login' && !this.blockDic[senderUserId]){
        console.log(this.id,this.chatRoomDic,chatRoomId)
        let chatRoomConfig = this.chatRoomDic[chatRoomId]
        //用户在此聊天室还没有准备好，消息的接受先存在队列里面
        if(!chatRoomConfig.isReady){
            chatRoomConfig.messageQueue.push(message)
        }else{
            let messageQueue = chatRoomConfig.messageQueue
            while (messageQueue.length>0){
                let preMessage = messageQueue.shift()
                this.ws.send(preMessage)
            }
            this.ws.send(message)
        }
    }
}

User.prototype.setWs = function(ws){
    this.ws = ws
}

User.prototype.login = function(){
    this.state = 'login'
}
User.prototype.isLogin = function(){
    return this.state === 'login'
}
User.prototype.logout = function(){
    this.state = 'logout'
}

User.prototype.setMessageCursor = function(chatRoomId,messageId){
    this.chatRoomDic[chatRoomId] && (this.chatRoomDic[chatRoomId].messageCursor = messageId)
}

User.prototype.getMessageCursor = function(chatRoomId){
    return this.chatRoomDic[chatRoomId] && this.chatRoomDic[chatRoomId].messageCursor
}

