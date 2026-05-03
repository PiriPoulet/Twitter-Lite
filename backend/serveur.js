const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const PORT = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(cors())
app.use('/public', express.static('public'))

mongoose.connect(process.env.MONGO_URI) 
.then(() => console.log("MongoDB connecté"))
.catch((err) => console.error("Erreur MongoDB :", err))

const authRoute = require("./Routes/auth")
const postsRoute = require("./Routes/posts")

app.use("/auth", authRoute)
app.use("/posts", postsRoute)

app.listen(PORT, () => {
    console.log("Serveur lancé sur http://localhost:" + PORT)
})