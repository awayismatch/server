
const Koa = require('koa');
const serve = require('koa-static');
const convert = require('koa-convert')
const mount = require('koa-mount')
const app = new Koa()
const webRouter = require('./routers/web')


require('koa-validate')(app)
require('koa-qs')(app,'first')
// body parser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())
app.keys = ['awayismatch'];


//对web端使用session及passport
let webMountPoint = new Koa()
// 使用passport+session进入验证
require('./webAuth')(webMountPoint)
webMountPoint.use(convert(webRouter.routes())).use(convert(webRouter.allowedMethods()))
app.use(mount('/web',webMountPoint))
//api
const apiRouter = require('./routers/api')
let apiMountPoint = new Koa()
apiMountPoint.use(convert(apiRouter.routes())).use(convert(apiRouter.allowedMethods()))
app.use(mount('/api',apiMountPoint))
//静态文件
let staticMountPoint = new Koa()
staticMountPoint.use(serve(__dirname + '/static'));
app.use(mount('/static',staticMountPoint))

app.listen(3000);