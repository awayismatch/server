/**
 * Created by awayisblue on 2017/3/12.
 */

const router = require('koa-router')();
const render = require('../lib/render')
const passport = require('koa-passport')
const User = require ('../models/User')
const bcrypt = require('bcryptjs');
const config = require('../config')
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt')
const convert = require('koa-convert')
function registerRoutes(router){
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
    router.get('/post',function*(next){

        this.body = this.state.user

    })
}


module.exports = function(app){

    app.use(koaJwt({secret:config.api.jwtSecret}).unless({path:['/login']}))
    registerRoutes(router)
    app.use(convert(router.routes())).use(convert(router.allowedMethods()))
}