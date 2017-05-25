/**
 * Created by John on 2017/5/25.
 */
module.exports = Handler
function Handler(ws){
    if(!(this instanceof Handler)){
        return new Handler(ws)
    }
    this.ws = ws
    this.handlerDic = {}
    this.handleMessage = this.handleMessage.bind(this)
}

Handler.prototype.use = function(action,fn){
    this.handlerDic[action] = fn
}

Handler.prototype.handleMessage = function(message){
    let ws = this.ws

    try{
        var msgObj = JSON.parse(message)

    }catch(err){
        let res = {status:'error',msg:'message should be an object'}
        return ws.send(s(res))
    }
    let action = msgObj.action
    if(!action){
        let res = {status:'error',msg:'message contain an action'}
        return ws.send(s(res))
    }
    let handler = this.handlerDic[action]
    if(!handler){
        let res = {status:'error',msg:'action ('+action+') cannot be handled'}
        return ws.send(s(res))
    }
    handler(msgObj).then((result)=>{
        let res = {status:'ok',result:result}
        ws.send(s(res))
    }).catch((err)=>{
        console.log(err)
        let res = {status:'error',msg:'server side error'}
        ws.send(s(res))
    })

}

function s(obj){
    return JSON.stringify(obj)
}