const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Post", postSchema)