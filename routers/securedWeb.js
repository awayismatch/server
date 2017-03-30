/**
 * Created by awayisblue on 2017/3/12.
 */


const KoaRouter = require('koa-router');
const render = require('../lib/render')
const passport = require('koa-passport')
var router = new KoaRouter()
router.use(function*(next) {
        if (this.isAuthenticated()) {
            yield next
        } else {
            this.body = yield render('/login')
        }
    })
router.get('/', function *(next) {
    this.body = 'body'
});


module.exports = router