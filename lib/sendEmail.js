/**
 * Created by awayisblue on 2017/3/22.
 */
const nodemailer = require('nodemailer')
const config = require('../config')
let transporter = nodemailer.createTransport(config.email);

module.exports = (mailOptions)=>{
    check(typeof mailOptions == 'object','mailOptions should be an Object')
    let keys = Object.keys(mailOptions)
    let requireKeys = ['to','subject','html']
    if(!mailOptions.from)mailOptions.from = '<'+config.email.auth.user+'>'
    check(inArray(requireKeys,keys),'mailOptions is not valid check require properties '+JSON.stringify(requireKeys))
    return transporter.sendMail(mailOptions)
}

function check(assert,errMsg){
    if(assert)return true
    throw new Error(errMsg)
}

function inArray(sub,main){
    return sub.every((element)=>{
        return main.indexOf(element)>-1
    })
}