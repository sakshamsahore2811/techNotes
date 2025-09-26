require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const logger = require('./middleware/logger')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000

connectDB()

console.log(process.env.NODE_ENV)

app.use(express.json())

app.use(logger)

// use static files from this route
app.use(express.static("public"))

// use routes/root for the root route
app.use("/",require("./routes/root"))

app.use("/user",require("./routes/userRoutes"))

// use views/404 for any undefined get request
app.use((req, res) => {
    res.status(404)
  
    if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
      res.json({ message: 'Error 404 - File not found' })
    } else {
      res.type('txt').send('404 File not found')
    }
  })

mongoose.connection.once('open',()=>{
console.log("Connect to Mongo DB")
  app.listen(PORT, ()=>console.log(`Server running on PORT ${PORT}`))
})
  
mongoose.connection.on('error',err=>{
  console.log(err)
})
