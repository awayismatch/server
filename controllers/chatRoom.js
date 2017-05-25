/**
 * Created by John on 2017/5/25.
 */

const ChatRoom = require('../models/ChatRoom')
const Profile = require('../models/Profile')
const User = require('../models/User')
const CrDisplayItem = require('../models/CrDisplayItem')

module.exports.getChatRoomUsers = async function(next){
    let res = {}
    let chatRoomId = this.params.crId
    let chatRoom = await ChatRoom.findOne({
        attributes:['id'],
        where:{id:chatRoomId}
    })
    if(!chatRoom)this.throw('400','chat room not found')
    let users = await chatRoom.getCrAttendances({
        attributes:['userId'],
        where:{
          status:'attend'
        },
        include:[{
            model:User,
            attributes:['id'],
            include:[{
                model:Profile,
                attributes:['name','avatar','gender']
            }]
        }]
    })
    res.result = users
    this.body = res
}


module.exports.getChatRooms = async function(next){
    let res = {}
    res.result = await CrDisplayItem.findAll({
        attributes:['chatRoomId'],
        include:{
            model:ChatRoom,
            attributes:{exclude:['id','userId','updatedAt']}
        }
    })
    this.body = res
}
