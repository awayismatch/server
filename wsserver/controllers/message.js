/**
 * Created by John on 2017/5/25.
 */
const redis = require('redis')
// const client = redis.createClient()
const bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
module.exports.login = async function(message){
    let {userId} = message
    // await client.setAsync('user'+userId,true)
    this.state.userId = userId
    return 'ok'
}
module.exports.send = async function(message){
    let userId = this.state.userId
    return userId
}

module.exports.operation = async function(message){

}