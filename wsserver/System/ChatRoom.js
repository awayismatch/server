/**
 * Created by awayisblue on 2017/5/25.
 */
const CrAttendance = require('../../models/CrAttendance')
const CrMessageCursor = require('../../models/CrMessageCursor')
const CrMessage = require('../../models/CrMessage')
module.exports = ChatRoom
function ChatRoom(crId){
    this.id = crId
this.userDic = {}
}
/**
 * 使一个用户加入聊天室
 * @param user  User的一个对象
 * @param check 是否在数据库检查已加入，false时，直接加入聊天
 * @returns {Promise.<void>}
 */
ChatRoom.prototype.addUser = async function(user,check){
    let chatRoomId = this.id
    let userId = user.id
    user.joinChatRoom(chatRoomId)
    if(check){
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
    user.setMessageCursor(chatRoomId,messageId)
    let messages = await CrMessage.findAll({
        attributes:['userId','id','text','createdAt'],
        where:{
            chatRoomId,
            id:{
                $gt:messageId,
            },
            userId:{
                $ne:userId
            }
        },
        order:[
            ['id','asc'],
        ],
        limit:100
    })
    for(let message of messages){
        let {userId,id,text,createdAt} = message
        let res = {action:'send',messageId:id,chatRoomId,userId,text,createdAt}
        user.ws.send(JSON.stringify(res))
    }
    user.chatRoomDic[chatRoomId].isReady = true
    this.userDic[user.id] = user
}

ChatRoom.prototype.broadcast = function(senderUserId,message){
    for(let key of Object.getOwnPropertyNames(this.userDic)){
        let user = this.userDic[key]
        if(senderUserId === user.id)continue
        user.send(this.id,senderUserId,message)
    }
}
/**
 * 离开聊天室
 * @param userId
 * @param persist 在数据库里体现，即删除并退出聊天室
 */
ChatRoom.prototype.leaveUser = async function(userId){
    await CrAttendance.destroy({where:{
        chatRoomId:this.id,
        userId
    }})
    delete this.userDic[userId]
    return 'ok'
}

ChatRoom.prototype.getUser = function(userId){
    return this.userDic[userId]
}