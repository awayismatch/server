/**
 * Created by awayisblue on 2017/3/12.
 */

const router = require('koa-router')();
const render = require('../lib/render')
const passport = require('koa-passport')
const User = require ('../models/User')
const bcrypt = require('bcryptjs');
const sendEmail = require('../lib/sendEmail')
router.get('/', function *(next) {
    let s = this.session
    if(!s.cnt)s.cnt = 1
    else
        s.cnt +=1
    console.log(s)
    this.body = yield render('index')
});
router.get('/login',function*(next){

        if(this.isAuthenticated()){
            console.log('isAuthenticated')
            this.redirect('/')
        }else{
            console.log(' !isAuthenticated')
            this.body = yield render('login')
        }

})
router.post('/login',function *(next){
    let ctx = this
    yield passport.authenticate('local', function(err, user, info, status) {
        if (!user) {
            ctx.body = { success: false }
            ctx.throw(401)
        } else {
            ctx.login(user)
            console.log('loginuser',user)
            return ctx.redirect('back')
        }
    })(ctx, next)
})
router.get('/logout',function *(next){
    this.logout()
    this.redirect('/login')
})


router.get('/register',function *(next){
    this.body = yield render('register')
})
router.get('/send',function *(next){
    let mailOptions = {
        to: 'example@qq.com', // list of receivers
        subject: 'send mail example', // Subject line
        text: 'Hi, I am text body', // plain text body
        html: '<a href="http://www.baidu.com">Hi, I am html body</a>' // html body
    };
    let result = yield sendEmail(mailOptions)

    this.body = result
})

router.post('/register',function *(next){
    // console.log(this.request.body)
    this.checkBody('email').isEmail('email format not correct')
    this.checkBody('password').notEmpty().len(3,20)
    let body = this.request.body

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(body.password, salt);
    let ctx = this
    yield User.sync().then(function () {
        // Table created
        return User.create({
            email: body.email,
            password: hash
        });
    }).then(function(){
        ctx.body = 'ok'
    }).catch(()=>{
        ctx.body = '用户已存在'
        // ctx.throw(401)
    });

})

module.exports = router