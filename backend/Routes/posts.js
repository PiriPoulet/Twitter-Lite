const express = require("express")
const router = express.Router()
const auth = require("../Middlewares/authMiddleware")
const Post = require("../Models/Post")

router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find({}).populate("user", "pseudo email")
        res.json(posts)
    } catch(err) {
        res.status(500).json({message: "Erreur serveur"})
    }
})

router.post("/", auth, async (req, res) => {
    try {
        const {pseudo, content} = req.body

        if (!content) {
            return res.status(400).json({message: "pseudo et content obligatoire"})
        }

        const newPost = await Post.create({
            pseudo,
            content, 
            user: req.user._id    
        })

        const populatedPost = await newPost.populate("user", "pseudo email")

        res.status(201).json(populatedPost)
    } catch(err) {
        res.status(500).json({message: "Erreur serveur"})
    }
})

router.delete("/:id", auth, async (req, res) => {
    try {
        const {id} = req.params
        const deletedPost = await Post.findOneAndDelete({_id: id})
        if (!deletedPost) {
            return res.status(404).json({message: "Post introuvable"})
        }
        res.json({message: "Post supprimé", deletedPost})

    } catch(err) {
        res.status(500).json({message: "Erreur serveur"})
    }
})

router.put("/:id", auth, async (req, res) => {
    try {
        const {id} = req.params
        const {content} = req.body


        if (!content) {
            return res.status(400).json({message: "content obligatoire"})
        }

        const updatedPost = await Post.findOneAndUpdate({_id: id, user: req.user._id}, {content}, {returnDocument: 'after'}).populate("user", "pseudo email")

        if (!updatedPost) {
            return res.status(404).json({message: "Post introuvable"})
        }
        res.json({message: "Post mis à jour", updatedPost})

    } catch(err) {
        res.status(500).json({message: "Erreur serveur"})
    }
})

router.put("/:id/likes", auth, async (req, res) => {
    try {
        const {id} = req.params

        const post = await Post.findById(id)

        if (!post) {
            return res.status(404).json({message: "post introuvable"})
        }

        const userId = req.user._id.toString()
        const hasLiked = post.likes.map(id => id.toString()).includes(userId)

        let updatedPost

        if (!hasLiked) {
            updatedPost = await Post.findByIdAndUpdate(id, {$addToSet: {likes: userId}}, {returnDocument: 'after'}).populate("user", "pseudo email")
        } else {
            updatedPost = await Post.findByIdAndUpdate(id, {$pull: {likes: userId}}, {returnDocument: 'after'}).populate("user", "pseudo email")
        }

        res.json({message: "likes updated", updatedLikes: updatedPost})
    } catch(err) {
        res.status(500).json({message: "Erreur serveur"})
    }
})

module.exports = router