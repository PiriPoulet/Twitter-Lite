const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../Models/User")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({storage: storage})

router.post("/register", upload.single("profilePic"), async (req, res) => {
    const {pseudo, email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({message: "email et password obligatoire"})
    }

    const existingUser = await User.findOne({email})

    if (existingUser) {
        return res.status(400).json({message: "Le compte existe déjà"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({pseudo, email, password: hashedPassword})

    console.log(newUser)

    const token = jwt.sign({_id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

    res.status(201).json({token, user: {_id: newUser._id, pseudo: newUser.pseudo, email: newUser.email}})
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({message: "Email et password obligatoire"})
    }

    const user = await User.findOne({email})

    if (!user) {
        return res.status(400).json({message: "Utilisateur introuvable"})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.status(400).json({message: "Le mot de passe ne correspond pas"})
    }

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

    res.json({token, user: {_id: user._id, pseudo: user.pseudo, email: user.email}})
})

module.exports = router