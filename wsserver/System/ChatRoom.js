/**
 * Created by awayisblue on 2017/5/25.
 */

module.exports = ChatRoom
function ChatRoom(chatRoomId){
    this.id = chatRoomId
    this.userDic = {}
}


//改变methods
ChatRoom.prototype.getAllUsers = function(){
    return this.userDic
}

ChatRoom.prototype.getUser = function(userId){
    return this.userDic[userId]
}
ChatRoom.prototype.addUser = function(user){
    return this.userDic[user.id] = user
}
