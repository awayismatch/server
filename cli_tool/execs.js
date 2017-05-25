/**
 * Created by John on 2017/5/23.
 */
const bcrypt = require('bcryptjs');
const sequelize = require('../models/sequelize')
const User = require('../models/User')
const Profile = require('../models/Profile')
const ChatRoom = require('../models/ChatRoom')
const CrAttendance = require('../models/CrAttendance')
const ContactRequest = require('../models/ContactRequest')
const CrBrowseHistory = require('../models/CrBrowseHistory')
const CrBlockedAttenders = require('../models/CrBlockedAttenders')
const CrDisplayItem = require('../models/CrDisplayItem')
const CrMessage = require('../models/CrMessage')
const FeedBack = require('../models/FeedBack')
const PasswordResetCode = require('../models/PasswordResetCode')
const BlockedUser = require('../models/BlockedUser')
const Contact = require('../models/Contact')
const Report = require('../models/Report')


module.exports.sync = async function(){
    let force  = process.argv[3] || false
    await User.sync({force})
    await Profile.sync({force})
    await ChatRoom.sync({force})
    await CrAttendance.sync({force})
    await ContactRequest.sync({force})
    await CrBrowseHistory.sync({force})
    await CrBlockedAttenders.sync({force})
    await CrDisplayItem.sync({force})
    await CrMessage.sync({force})
    await FeedBack.sync({force})
    await PasswordResetCode.sync({force})
    await BlockedUser.sync({force})
    await Contact.sync({force})
    await Report.sync({force})
}

module.exports.addUser = async function(){
    let phone = process.argv[3]
    let profile = {
        avatar:'http://img2.woyaogexing.com/2017/05/22/d5e40ba9037adec6!400x400_big.jpg',
        gender:'male',
        name:process.argv[4] || 'Matcher',
        region:'广东广州',
        birthday:'1993-08-08',

    }
    if((phone).length<11)phone = parseInt(phone)+13600000000;
    let password = '12345678'
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    let connection = await sequelize.transaction()
    try{
        await User.sync()
        await Profile.sync()
        let user = await User.create({
            phone,
            password:hash
        },{transaction:connection})
        profile.userId = user.id
        await Profile.create(profile,{transaction:connection})
        await connection.commit()
    }catch (err){
        await connection.rollback()
        throw err
    }
    return 'created'
}

module.exports.createCR = async function(){
    let chatRoom = {
        createrUserId:process.argv[3] || 1,
        genderPlan:process.argv[4] || 'all',
        topic:process.argv[5] || '阿尔法狗大战柯洁，怎么看？',
        totalAmount:40,
        femaleAmount:20,
        maleAmount:20,
        roomType:'public',
    }

    await ChatRoom.sync()
    let created = await ChatRoom.create(chatRoom)
    return 'created chatRoomId:'+created.id
}
module.exports.suggestUsers = async function(){
    return await User.findAll({
        attributes:['id'],
        limit:5,
        order:[['id','desc']],
        raw:true
    })
}
module.exports.suggestCRs = async function(){
    return await ChatRoom.findAll({
        attributes:['id','topic','genderPlan','totalAmount','femaleAmount','maleAmount'],
        limit:5,
        order:[['id','desc']],
        raw:true
    })
}
module.exports.attendCR = async function(){
    let crAttender = {
        userId:process.argv[3] || 1,
        chatRoomId:process.argv[4] || 1
    }
    await CrAttender.sync()
    await CrAttender.create(crAttender)
    return 'created'
}

module.exports.reqFriend = async function(){
    let request = {
        userId:process.argv[3] || 1,
        contactUserId:process.argv[4] || 2,
        remark:'加个好友吧！',
        status:'pending'
    }
    await ContactRequest.sync()
    await ContactRequest.create(request)
    return 'created'
}

