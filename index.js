
const Koa = require('koa');
const serve = require('koa-static');
const convert = require('koa-convert')
const mount = require('koa-mount')
const app = new Koa()

require('koa-validate')(app)
require('koa-qs')(app,'first')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
app.keys = ['awayismatch'];

app.use(convert(session({
    store: redisStore()
})));

// body parser
const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// authentication
require('./auth')
const passport = require('koa-passport')
app.use(passport.initialize())
app.use(passport.session())

//mount point
const webRouter = require('./routers/web')
const sWebRouter = require('./routers/securedWeb')
let openMountPoint = new Koa()
let securedMountPoint = new Koa()
let staticMountPoint = new Koa()
securedMountPoint.use(convert(sWebRouter.routes())).use(convert(sWebRouter.allowedMethods()))
openMountPoint.use(convert(webRouter.routes())).use(convert(webRouter.allowedMethods()))
staticMountPoint.use(serve(__dirname + '/static'));
app.use(mount(openMountPoint))
app.use(mount('/secured',securedMountPoint))
app.use(mount('/static',staticMountPoint))
app.listen(3000);