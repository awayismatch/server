/**
 * Created by awayisblue on 2017/3/17.
 */
const passport = require('koa-passport')
const User = require ('./models/User')
const bcrypt = require('bcryptjs')
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