
const execs = require('./execs')
let command = process.argv[2]
let supportedCommands = Object.getOwnPropertyNames(execs)
if(supportedCommands.indexOf(command)=== -1){
    return notify(supportedCommands)
}
execs[command]().then((msg)=>{
    console.log(msg)
    process.exit(0)
}).catch((err)=>{
    console.log(err)
    process.exit(1)
})
function notify(commands){
    console.log('supported commands are:',JSON.stringify(commands))
}