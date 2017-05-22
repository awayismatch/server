const User = require('../models/User')
const Profile = require('../models/Profile')
const bcrypt = require('bcryptjs');
const sequelize = require('../models/sequelize')
let command = process.argv[2]

switch (command){
    case 'addUser':
        let profile = {
            avatar:'http://img2.woyaogexing.com/2017/05/22/d5e40ba9037adec6!400x400_big.jpg',
            gender:'male',
            name:'Matcher',
            region:'广东广州',
            birthday:'1993-08-08',

        }
        let phone = process.argv[3]
        if((phone).length<11)phone = parseInt(phone)+13600000000;
        (async function(){
            let password = '12345678'
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);
            let connection = await sequelize.transaction()
            try{
                await User.sync()
                await Profile.sync()
                let user = await User.create({
                    phone,
                    password:hash
                },{transaction:connection})
                profile.userId = user.id
                await Profile.create(profile,{transaction:connection})
                await connection.commit()
            }catch (err){
                await connection.rollback()
                throw err
            }

        })().then(()=>{
            console.log('created')
        }).catch((err)=>{
            console.log(err)
        })
        break
    default:
        let supportedCommands = ['addUser']
        notify(supportedCommands)
}

function notify(commands){
    console.log('supported commands are:',JSON.stringify(commands))
}