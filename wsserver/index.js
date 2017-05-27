const WebSocket = require('ws');
const Router = require('./System/Router')
const wss = new WebSocket.Server({ port: 3333 });
const controller = require('./System/controller')
const middleware = require('./System/middleware')

wss.on('connection', function connection(ws) {
    let router = new Router(ws)
    router.use(middleware.checkLogin,{exclude:['login']})

    router.use('login',controller.login)
    router.use('send',controller.send)

    router.use('block',controller.block)
    router.use('unblock',controller.unblock)

    router.use('attend',controller.attend)
    router.use('quit',controller.quit)

    router.use('msgRes',controller.msgRes)
    ws.on('message', router.handleMessage);
    ws.on('close',router.handleClose)
});
