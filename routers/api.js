/**
 * Created by awayisblue on 2017/3/12.
 */

const router = require('koa-router')();
const render = require('../lib/render')
const passport = require('koa-passport')
const bcrypt = require('bcryptjs');
const config = require('../config')
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt')
const convert = require('koa-convert')
function registerRoutes(router){
    /**
     * 用户搜索功能
     * get:通过手机号获取用户,需要把手机号加入query
     */
    router.get('/users',function*(next){

    })

    /**
     * 个人资料
     * get:获取个人资料
     * put:更新个人资料,若不存在则创建
     * patch:部分更新个人资料
     *
     */
    router.get('/users/:uid/profiles',function*(next){

    })
    router.put('/users/:uid/profiles',function*(next){

    })

    router.patch('/users/:uid/profiles',function*(next){

    })

    /**
     * 聊天室
     * get:获取聊天室列表,内部实现里，get 是从CrDisplayItems里拿的，因为是否展示是系统调控的。
     * post:创建聊天室
     */
    router.get('/chatRooms',function*(next){

    })
    router.post('/chatRooms',function*(next){

    })
    /**
     * 聊天室参与者：
     * get:获取加入聊天室的人员
     * put:加入聊天室或退出聊天室，通过status来识别
     * patch:更新对于该聊天室的设置，比如说消息免打扰等。
     */
    router.get('/chatRooms/:crId/users',function*(next){

    })
    router.put('/chatRooms/:crId/users',function*(next){

    })
    router.patch('/chatRooms/:crId/users/:uid',function*(next){

    })

    /**
     * 聊天室内屏蔽某人：
     * put:屏蔽情况更新，可以为屏蔽或取消屏蔽
     */
    router.put('/chatRooms/:crId/users/:uid/blocks',function*(next){

    })

    /**
     * 好友请求：
     * get: 别人对我的请求列表
     * put：若之前请求过，则更新请求，若没有，则对别人发起好友请求
     * patch:对别人对我发起的请求进行操作，比如说通过，拒绝等。通过时会创建联系人。
     */
    router.get('/users/:uid/contactRequests',function*(next){

    })
    router.put('/users/:uid/contactRequests',function*(next){

    })
    router.patch('/users/:uid/contactRequests/:id',function*(next){

    })

    /**
     * 联系人列表：
     * get:获取联系人列表
     * delete:删除联系人
     * patch:部分更新联系人，主要用于修改备注等操作。
     */
    router.get('/users/:uid/contacts',function*(next){

    })
    router.delete('/users/:uid/contacts/:id',function*(next){

    })
    router.patch('/users/:uid/contacts/:id',function*(next){

    })
    /**
     * 举报：
     * post:向某人发起举报，需带上被举报的userId,
     */
    router.post('/users/:uid/reports',function*(next){

    })

    /**
     * 加入黑名单：
     * put:把某人加入黑名单,或移出黑名单，需带上被加入黑名单者的userId,
     */
    router.put('/users/:uid/blocks',function*(next){

    })

    /**
     * 反馈：
     * post:添加反馈内容
     */
    router.post('/users/:uid/feedBacks',function*(next){

    })
}


module.exports = function(app){

    // app.use(koaJwt({secret:config.api.jwtSecret}).unless({path:[/\/login/]}))
    registerRoutes(router)
    app.use(convert(router.routes())).use(convert(router.allowedMethods()))
}