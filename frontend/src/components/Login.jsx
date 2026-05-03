import {useState} from "react"

const Login = () => {
    const [pseudo, setPseudo] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            const response = await fetch("http://localhost:5000/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({pseudo, email, password})
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
            console.error(`Fetch échoué : ${err}`)
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={pseudo} onChange={(e) => setPseudo(e.target.value)} placeholder="Pseudo" />
                <input type="text" value={email} onChange={((e) => setEmail(e.target.value))} placeholder="Email" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button>Login</button>
                {error && <p style={{color: "red"}}>{error}</p> }
            </form>
        </div>
    )
}

export default Login