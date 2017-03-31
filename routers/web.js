/**
 * Created by awayisblue on 2017/3/12.
 */

const router = require('koa-router')();
const render = require('../lib/render')
const passport = require('koa-passport')
const User = require ('../models/User')
const RegistrationCode = require ('../models/RegistrationCode')
const bcrypt = require('bcryptjs');
const sendEmail = require('../lib/sendEmail')
const utils = require('../lib/utils')
const uuid = require('uuid')
const convert = require('koa-convert')

function registerRoutes(router){
    //仅为测试使用。///////////////////////////////////
    router.get('/register',function *(next){
        this.body = yield render('register')
    })
    //////////////////////////////////////////////////////////////

    router.post('/register',function *(next){
        // console.log(this.request.body)

        let body = this.request.body
        let email = body.email
        if(!utils.validateEmail(email))this.throw('邮件格错误！',400)
        let code = uuid.v4()
        let href = 'http://localhost:3000/web/setPassword?code='+encodeURIComponent(code)
        let mailOptions = {
            to: email, // list of receivers
            subject: '设置密码', // Subject line
            html: '<a href="'+href+'" target="_blank">打开设置密码</a>' // html body
        };
        try{
            var result = yield sendEmail(mailOptions)
        }catch(err){
            console.log(err)
            return this.throw('发送邮件出错',500)
        }
        let ctx = this
        yield RegistrationCode.sync({force:true}).then(function () {
            // Table created
            return RegistrationCode.create({
                email: email,
                code:code
            });
        }).then(function(){
            ctx.body = result
        }).catch((err)=>{
            console.log(err)
            ctx.throw(500)
        });

    })

    router.get('/setPassword',function *(){
        let query = this.query
        let code = query.code

        let target = yield RegistrationCode.findOne({
            where:{
                code:code,
                activated:0,
            },
            raw:true
        })
        if(!target)this.throw('code不正确或已失效，请重新注册',400)

        this.body = yield render('setPassword')
    })

    router.post('/setPassword',function *(){
        let query = this.query
        let code = query.code
        let target = yield RegistrationCode.findOne({
            where:{
                code:code,
                activated:0,
            },
            raw:true
        })
        if(!target)this.throw('code不正确或已失效，请重新注册',400)
        //密码长度：6-20位
        let body = this.request.body
        let password = body.password,repeat = body.repeat
        if(password !==repeat)this.throw('密码不一致！',400)
        if(password.length<6||password.length>20)this.throw('密码长度为6-20',400)

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);
        let user = yield User.sync({force:true}).then(function(){
            return User.create({
                email: target.email,
                password:hash
            })
        })
        console.log(user)
        this.body = user

    })
}

module.exports = function(app){
    registerRoutes(router)
    app.use(convert(router.routes())).use(convert(router.allowedMethods()))
}