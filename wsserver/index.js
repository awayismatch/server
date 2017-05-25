const WebSocket = require('ws');
const Handler = require('./Handler')
const wss = new WebSocket.Server({ port: 3333 });
const messageController = require('./controllers/message')

wss.on('connection', function connection(ws) {
    let handler = new Handler(ws)
    handler.use(async function checkLogin(){
        let userId = this.state.userId
        if(!userId)throw 'unAuthorize'
    },{exclude:['login']})
    handler.use('login',messageController.login)
    handler.use('send',messageController.send)
    handler.use('operation',messageController.operation)
    ws.on('message', handler.handleMessage);

});
