/**
 * Created by awayisblue on 2017/3/12.
 */

const router = require('koa-router')();
const render = require('../lib/render')
const passport = require('koa-passport')
const User = require ('../models/User')
const bcrypt = require('bcryptjs');
const config = require('../config')
const sendEmail = require('../lib/sendEmail')
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt')
const convert = require('koa-convert')

router.get('/login',function*(next){
    console.log('login')
    this.body = yield render('login')

})
router.post('/login',function *(next){
    let body = this.request.body

    let password = body.password,email = body.email
    let user = yield User.findOne({
        where:{
            email:email
        },
        raw:true
    })
    if(!user)this.throw('用户不存在！',400)

    if(!bcrypt.compareSync(password, user.password))this.throw('密码错误！',400)
    // this.body =
    let token = jwt.sign({id:user.id},config.api.jwtSecret,{expiresIn:'1h'})
    this.body = token

})


router.get('/register',function *(next){
    this.body = yield render('register')
})
router.get('/send',function *(next){
    let mailOptions = {
        to: 'example@qq.com', // list of receivers
        subject: 'send mail example', // Subject line
        text: 'Hi, I am text body', // plain text body
        html: '<a href="http://www.baidu.com">Hi, I am html body</a>' // html body
    };
    let result = yield sendEmail(mailOptions)

    this.body = result
})

router.post('/register',function *(next){
    // console.log(this.request.body)
    this.checkBody('email').isEmail('email format not correct')
    this.checkBody('password').notEmpty().len(3,20)
    let body = this.request.body

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(body.password, salt);
    let ctx = this
    yield User.sync().then(function () {
        // Table created
        return User.create({
            email: body.email,
            password: hash
        });
    }).then(function(){
        ctx.body = 'ok'
    }).catch(()=>{
        ctx.body = '用户已存在'
        // ctx.throw(401)
    });

})

module.exports = function(app){
    app.use(convert(router.routes())).use(convert(router.allowedMethods()))
    app.use(koaJwt({secret:config.api.jwtSecret}).unless({path:['/login']}))
}