
const Koa = require('koa');
const serve = require('koa-static');

const mount = require('koa-mount')
const app = new Koa()



require('koa-validate')(app)
require('koa-qs')(app,'first')
// body parser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())
app.keys = ['awayismatch'];


//对web端
let webMountPoint = new Koa()
require('./routers/web')(webMountPoint)
app.use(mount('/web',webMountPoint))

//api
let apiMountPoint = new Koa()
require('./routers/api')(apiMountPoint)
app.use(mount('/api',apiMountPoint))
//静态文件S
let staticMountPoint = new Koa()
staticMountPoint.use(serve(__dirname + '/static',{maxage:365*24*60*60}));
app.use(mount('/static',staticMountPoint))

app.listen(3000);