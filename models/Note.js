const mongoose = require('mongoose')

const AutoIncrement = require('mongoose-sequence')(mongoose)

const NoteSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    id:{
        type:Number,
        required:true
    },
    title:{
        type:String,
        required: true
    },
    text:{
        type:String,
        required:true
    },
    active:{
        type: Boolean,
        required: true
    }
},{
    timestamps:true
}
)

NoteSchema.plugin(AutoIncrement,{
    inc_field:'ticket',
    id:'ticketNums',
    start_seq:500
})

module.exports = mongoose.model('Note',NoteSchema)