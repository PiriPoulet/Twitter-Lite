const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    profilePic: {
        type: String,
        default: "/public/profilePic.svg" 
    },
    pseudo: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type : String,
        required : true,
        unique : true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true

    }
})

module.exports = mongoose.model("User", userSchema)