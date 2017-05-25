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
    let {offset,limit} = this.query
    offset = parseInt(offset) ||0
    limit = parseInt(limit) || 20
    let res = {}
    let chatRooms =  await ChatRoom.findAll({
        attributes:{exclude:['userId','updatedAt']},
        order:[
            ['id','desc']
        ],
        where:{roomType:'public'},
        offset,
        limit
    })
    if(chatRooms.length < limit){
        res.nextOffset = null
    }else{
        res.nextOffset = offset + limit
    }
    res.offset = offset
    res.limit = limit
    res.result = chatRooms
    this.body = res
}
