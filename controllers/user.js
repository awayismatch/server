/**
 * Created by John on 2017/5/25.
 */
const User = require('../models/User')
const Profile = require('../models/Profile')
const ChatRoom = require('../models/ChatRoom')
const Contact = require('../models/Contact')
const Report = require('../models/Report')
const BlockedUser = require('../models/BlockedUser')
const CrAttender = require('../models/CrAttendance')
const FeedBack = require('../models/FeedBack')
const ContactRequest = require('../models/ContactRequest')
const CrDisplayItem = require('../models/CrDisplayItem')
const bcrypt = require('bcryptjs');
module.exports.searchUser = async function(next){
    let res = {}
    let phone = this.query.phone
    let profile = await User.findOne({
        attributes:['phone',['id','userId']],
        where:{phone},
        include:[
        {
            model:Profile,
            attributes:{exclude:['id','userId','createdAt','updatedAt']}
        }
    ]})
    res.result = profile
    this.body = res
}
module.exports.postUser = async function(next){
    let res = {}
    let {phone,password} = this.request.body
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    let user = await User.create({
        phone,
        password:hash
    })
    res.result = 'created'
    this.body = res
}
module.exports.getProfile = async function(next){
    let res = {}
    let uid = this.params.uid
    let user = await User.findOne({
        attributes:[],
        where:{id:uid},
        include:[
            {
                model:Profile,
                attributes:{exclude:['id','createdAt','updatedAt']}
            }
        ]})
    res.result = user
    this.body = res
}

module.exports.putProfile = async function(next){
    let res = {}
    let userId = this.params.uid
    let {avatar,gender,name,region,birthday,email,whatsUp} = this.request.body
    let profile = {
        userId,
        avatar,
        gender,
        name,
        region,
        birthday,
        email,
        whatsUp
    }
    let user = await User.findOne({
        attributes:['id'],
        where:{id:userId},
    })
    if(!user)this.throw('400','user not found')
    let created = await Profile.insertOrUpdate(profile)
    res.result = 'ok'
    this.body = res
}

module.exports.patchProfile = async function(next){
    let res = {}
    let userId = this.params.uid
    let {avatar,gender,name,region,birthday,email,whatsUp} = this.request.body
    let updateData = {}
    avatar && (updateData.avatar = avatar)
    gender && (updateData.gender = gender)
    name && (updateData.name = name)
    region && (updateData.region = region)
    birthday && (updateData.birthday = birthday)
    email && (updateData.email = email)
    whatsUp && (updateData.whatsUp = whatsUp)

    let user = await User.findOne({
        attributes:['id'],
        where:{id:userId},
    })
    if(!user)this.throw('400','user not found')


    await Profile.update(updateData,{where:{userId}})
    res.result = 'ok'
    this.body = res
}

module.exports.postChatRoom = async function(next){
    let res = {}
    let userId = this.params.uid
    let {topic,genderPlan,totalAmount,femaleAmount,maleAmount,roomType} = this.request.body

    let user = await User.findOne({
        attributes:['id'],
        where:{id:userId},
    })
    if(!user)this.throw('400','user not found')
    let chatRoom = {
        userId,
        topic,
        genderPlan,
        totalAmount,
        femaleAmount,
        maleAmount,
        roomType
    }

    let created = await ChatRoom.create(chatRoom)
    await CrAttender.create({
        chatRoomId:created.id,
        userId,
    })
    //以一定的策略进行推荐，为了简单，这里一概加入
    await CrDisplayItem.create({chatRoomId:created.id})
    res.result = created
    this.body = res
}

module.exports.getContacts = async function(next){
    let res = {}
    let userId = this.params.uid
    let contacts = await Contact.findAll({where:{
        userId
    }})

    res.result = contacts
    this.body = res
}

module.exports.deleteContact = async function(next){
    let res = {}
    let userId = this.params.uid
    let id = this.params.id

    let cnt = await Contact.destroy({
        where:{
            userId,
            id
        }
    })
    res.result = cnt
    this.body = res
}

module.exports.patchContact = async function(next){
    let res = {}
    let userId = this.params.uid
    let id = this.params.id
    let {remark} = this.request.body
    await Contact.update({
        remark
    },{
        where:{
            userId,
            id
        }
    })
    res.result = 'ok'
    this.body = res
}
module.exports.postReport = async function(next){
    let res = {}
    let userId = this.params.uid
    let {reportedUserId,content} = this.request.body

    let user = await User.findOne({
        attributes:['id'],
        where:{id:userId},
    })
    if(!user)this.throw('400','user not found')
    let report = {
        userId,
        reportedUserId,
        content
    }

    let created = await Report.create(report)

    res.result = created
    this.body = res
}

module.exports.putBlockUser = async function(next){
    let res = {}
    let userId = this.params.uid
    let {blockedUserId,block} = this.request.body
    let blockUser = {
        userId,
        block,
        blockedUserId
    }
    let user = await User.findOne({
        attributes:['id'],
        where:{id:userId},
    })
    if(!user)this.throw('400','user not found')
    await BlockedUser.insertOrUpdate(blockUser)
    res.result = 'ok'
    this.body = res
}

module.exports.postFeedBack = async function(next){
    let res = {}
    let userId = this.params.uid
    let {content} = this.request.body

    let user = await User.findOne({
        attributes:['id'],
        where:{id:userId},
    })
    if(!user)this.throw('400','user not found')
    let feedBack = {
        userId,
        content
    }

    let created = await FeedBack.create(feedBack)

    res.result = created
    this.body = res
}

module.exports.getContactRequests = async function(next){
    let res = {}
    let userId = this.params.uid

    let user = await User.findOne({
        attributes:['id'],
        where:{id:userId},
    })
    if(!user)this.throw('400','user not found')

    let requests = await user.getContactRequests()

    res.result = requests
    this.body = res
}