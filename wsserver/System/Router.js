/**
 * Created by John on 2017/5/25.
 */
const system = require('./singleSystem')
const CrMessageCursor = require('../../models/CrMessageCursor')
module.exports = Router
function Router(ws){
    if(!(this instanceof Router)){
        return new Router(ws)
    }
    this.ws = ws
    this.handlerDic = {}

    this.middlewares = []
    this.handleMessage = this.handleMessage.bind(this)
    this.handleClose = this.handleClose.bind(this)
}
/**
 * 支持两种方式
 * 1. use(async function(message){},config)
 *    config暂时只支持exclude,exclude为一个数组，里面包含忽略的action
 * 2. use(action,async function(message){})
 * @param action
 * @param fn
 */
Router.prototype.use = function(action,fn){
    if('function' === typeof action){
        let config = fn
        fn = action
        action = null
        fn = fn.bind(this)
        config && (fn.config = config)
        this.middlewares.push(fn)
    }else{
        this.handlerDic[action] = fn.bind(this)
    }
}

Router.prototype.handleMessage = function(message){
    let ws = this.ws
    _handleMessage.call(this,message).then((res)=>{
        let result = {status:'ok',result:res}
        ws.send(s(result))
    }).catch((err)=>{
        console.log('err',err)
        let res = {status:'error',msg:err}
        ws.send(s(res))
    })
}
Router.prototype.handleClose = function(){
    _handleClose.call(this).then().catch()
}

async function _handleMessage(message){

    try{
        var msgObj = JSON.parse(message)

    }catch(err){
        console.log(err,message)
        throw 'message should be an object'
    }
    let action = msgObj.action
    if(!action){
        throw 'message must contain an action'
    }
    let handler = this.handlerDic[action]
    if(!handler){
        throw 'action ('+action+') cannot be handled'
    }
    try{
        for(let fn of this.middlewares){
            if(fn.config){



                let exclude = fn.config.exclude
                if(exclude && ~exclude.indexOf(action))continue
            }
            await fn(msgObj)
        }
        return await handler(msgObj)
    }catch (err){
        throw err
    }

}

async function _handleClose(){
    let userId = this.userId
    let user = system.getUser(userId)
    let t = system.logoutUser(userId)
    console.log('t',t)
    let cursors = user.getAllMessageCursors()
    for(let chatRoomId of Object.getOwnPropertyNames(cursors)){
        let messageId = cursors[chatRoomId]
        await CrMessageCursor.insertOrUpdate({
            chatRoomId,
            userId:this.userId,
            crMessageId:messageId
        },{
            where:{chatRoomId,userId}
        })
    }
}
function s(obj){
    return JSON.stringify(obj)
}