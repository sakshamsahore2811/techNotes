const Note = require('../models/Note')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @get route
// gets a list of all the users
// private access (later)
const getAllUsers = asyncHandler(async(req,res) =>{
    const users = await User.find().select('-password').lean().exec()
    if (!users || users.length===0){
        return res.status(400).json({message:"No user found"})
    }
    res.status(200).json(users)
})

// @post route
// creates a new user
//private access 
const createNewUser = asyncHandler(async(req,res)=>{
    const {username,password,roles} = req.body

    if (!username || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message:"Please input all required fields"})
    }

    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate){
    return res.status(409).json({message:"Username already exists"})        
    }

    const hashedPwd = await bcrypt.hash(password,10)
    const user = await User.create({username,"password":hashedPwd,roles})
    
    if(user){
        res.status(200).json({message:`User ${username} successfully created`})
    }
    else{
        res.status(404).json({message:"Error creating new user"})
    }

})

// @patch request
// Updates existing user
// Doesn't allow username update if it already exists
const updateUser = asyncHandler(async(req,res)=>{
    const {id, username, password, active, roles} = req.body

    if(!id || !username || !password || typeof(active)!=Boolean || !Array.isArray(roles)){
        return res.status(400).json({message:"All fields are required"})
    }

    const user = await User.findById(id)
    if(!user){
        return res.json({message:"Could not find the user"})
    }

    const duplicate = await User.findOne({username}).lean().exec()
    if(duplicate && duplicate?._id.toString() != id){
        return res.status(409).json({message:"Username already exists"})
    }
    user.name = username
    user.active = active
    user.roles = roles
 
        
    
    if(password){
        user.password = await bcrypt.hash(password,10)
    }
    const updatedUser = user.save()
    if(updatedUser){
    res.json({message:`User ${username} updated successfully`})
    }
})

// @delete request
// deletes user from the app
const deleteUser = asyncHandler(async(req,res)=>{
    const {id} = req.body
    const user = await User.findById(id).lean().exec()
    if(!user){
        return res.status(400).json({message:"User not found"})
    }
    const result = user.deleteOne()
    if(result){
    res.status(200).json({message:`${username} deleted successfully`})
    }
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}
