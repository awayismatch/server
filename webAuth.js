/**
 * Created by awayisblue on 2017/3/17.
 */
const KoaPassport = require('koa-passport').KoaPassport
const User = require ('./models/User')
const bcrypt = require('bcryptjs')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const convert = require('koa-convert')
const fetchUser = (email) => {
    // This is an example! Use password hashing in your
    // const user = { id: 1, username: 'test', password: 'test' }
    return User.findOne({
        where:{
            email:email
        },
        raw:true
    })
}

let passport = new KoaPassport()
//serialize信息（email）存在session中，当某个cookie访问时，会跟据email deserialize得到用户，直接通过request.user得到。
passport.serializeUser(function(user, done) {
    done(null, user.email)
})

passport.deserializeUser(async function(email, done) {
    try {
        const user =  fetchUser(email)
        done(null, user)
    } catch(err) {
        done(err)
    }
})

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy({usernameField:'email',passwordField:'password'},function(email, password, done) {
    fetchUser(email)
        .then(user => {
            if (email === user.email && bcrypt.compareSync(password, user.password)) {
                console.log('done auth')
                done(null, user)
            } else {
                console.log('fail auth')
                done(null, false)
            }
        })
        .catch(err => done(err))
}))
module.exports = function(web){
    web.use(convert(session({
        store: redisStore()
    })));
    web.use(passport.initialize())
    web.use(passport.session())
}