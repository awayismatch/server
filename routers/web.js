/**
 * Created by awayisblue on 2017/3/12.
 */

const router = require('koa-router')();
const render = require('../lib/render')
const passport = require('koa-passport')
const bcrypt = require('bcryptjs');
const sendEmail = require('../lib/sendEmail')
const utils = require('../lib/utils')
const uuid = require('uuid')
const convert = require('koa-convert')

function registerRoutes(router){
    router.get('/ws',async function(){
        this.body = await render('ws')
    })
}

module.exports = function(app){
    registerRoutes(router)
    app.use(convert(router.routes())).use(convert(router.allowedMethods()))
}