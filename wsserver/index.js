const WebSocket = require('ws');
const Handler = require('./wshandler')
const wss = new WebSocket.Server({ port: 3333 });
const messageController = require('./controllers/message')

wss.on('connection', function connection(ws) {
    let handler = new Handler(ws)
    handler.use('login',messageController.login)
    handler.use('send',messageController.send)
    ws.on('message', handler.handleMessage);

});
