const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema.Types
const USER = mongoose.model("USER")

const postSchema = new mongoose.Schema (
    {
    body: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true
    },
    likes: [{type:ObjectId, ref:"USER"}], 
    comments: [{
        comment:{type: String},
        postedBy: {type: ObjectId, ref: "USER"}
    }],
    postedBy: {
        type: ObjectId, // which user is posting
        ref: "USER"
    }
},{timestamps: true}
) 
mongoose.model("POST", postSchema)