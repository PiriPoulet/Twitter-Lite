import {useState} from "react"

const Register = () => {

    const [profilePic, setProfilePic] = useState(null)
    const [pseudo, setPseudo] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleRegister = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const formData = new FormData()
            formData.append("profilePic", profilePic)
            formData.append("pseudo", pseudo)
            formData.append("email", email)
            formData.append("password", password)

            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                body: formData
            })
            const data = await response.json()
            if (!response.ok) {
                setError(data.message)
                return
            }
            localStorage.setItem("token", data.token)
            localStorage.setItem("userId", data.user._id)
            localStorage.setItem("pseudo", data.user.pseudo)
            window.location.href = "/"
        } catch(err) {
            setError("Erreur serveur")
            console.error(`Fetch échoué: ${err}`)
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
                <input type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder="Pseudo" />
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button>Sign Up</button>
                {error && <p style={{color: "red"}}>{error}</p> }
            </form>
        </div>
    )
}

export default Register