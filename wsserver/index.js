const WebSocket = require('ws');
const Handler = require('./Handler')
const wss = new WebSocket.Server({ port: 3333 });
const messageController = require('./controllers/message')

const system = require('./System')
wss.on('connection', function connection(ws) {
    let handler = new Handler(ws)
    handler.use(async function checkLogin(){
        let systemUser = system.userDic[this.userId]
        if(systemUser &&systemUser.isLogin())return 'ok'
        throw 'unAuthorize'
    },{exclude:['login']})

    handler.use('login',messageController.login)
    handler.use('send',messageController.send)
    handler.use('attend',messageController.attend)
    handler.use('msgRes',messageController.msgRes)
    handler.use('bulkRes',messageController.bulkRes)
    ws.on('message', handler.handleMessage);

    ws.on('close',onclose.bind(handler))
    function onclose(){
        console.log(system,system.userDic)
        system.removeUser(this.userId)
    }

});
