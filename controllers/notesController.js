const asyncHandler = require('express-async-handler')
const Note = require('../models/Note')

const getAllNotes = asyncHandler(async(req,res)=>{
    const notes = await Note.find().lean().exec()
    if(!notes || notes.length===0){
        return res.status(404).json({message:"No notes found"})
    }
    res.status(200).json(notes)
}
)

const createNewNote = asyncHandler(async(req,res)=>{
    const {user, title, text, active} = req.body
    if (!user || !title || !text || typeof active != Boolean){
        return res.status(409).json({message:"Please fill in all the required fields"})
    }
    const newNote = await Note.create({user,title,text,active})
    if (newNote){
        res.status(200).json({message:`Note created successfuly ${newNote}`})
    }else{
        res.status(404).json({message:"Invalid request"})
    }
})

const updateNote = asyncHandler(async(req,res)=>{
    const {_id, title, text, active, user} = req.body
    const note = await Note.findById(_id).lean().exec()
    if (!title || !text || typeof active!= Boolean || !user){
        return res.status(409).json({message:"Please provide value for all the fields"})
    }
    note.title = title
    note.text = text
    note.active = active
    note.user = user
    note.save()
    res.status(200).json({message:`Note ${title} updated successfully`})

})

const deleteNote = asyncHandler(async(req,res)=>{
const {_id} = req.body
const note = Note.findById(_id).lean().exec()
if(!note){
    return res.status(404).json({message:"No note found"})
}
const result = await note.deleteOne()
if (!result){
    return res.status(400).json({message:"Something went wrong"})
}
res.status(200).json({message:`Note ${note.title} deleted successfully`})

})

module.exports = {getAllNotes,createNewNote,updateNote,deleteNote}