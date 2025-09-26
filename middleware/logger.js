import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async(message, fileName)=>{
    const date = `${format(new Date(),`yyyyMMdd\tHH:mm:ss`)}`
    const logItem = `${date}\t${uuid()}\t${message}\n`

    try{
    if(!fs.existsSync(path.join(__dirname,"..","logs"))){
        await fsPromises.mkdir(path.join(__dirname,"..","logs"))
    }
    await fsPromises.appendFile(path.join(__dirname,"..","logs",fileName),logItem)
    }
    catch(err){
        console.log(err)
    }
}

const logger = (req,res,next)=>{
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`,'logFile.log')
    console.log(`${req.method}\t${req.url}`)
    next()
}

module.exports = logger