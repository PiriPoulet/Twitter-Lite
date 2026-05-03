import {useEffect, useState, useRef} from "react"
import "./Feed.css"

const dateFromNow = (dateDuPost) => {
    const dateMs = new Date(dateDuPost).getTime()
    const currentDate = Date.now()
    const dateFrom = currentDate - dateMs
    const dateSecond = dateFrom / 1000
    const dateMinute = dateSecond / 60
    const dateHour = dateMinute / 60
    const dateDay = dateHour / 24

    if (dateSecond < 60) {
        return "Il y a un instant"
    } else if (dateMinute < 60) {
        if (Math.floor(dateMinute) > 1) {
            return `Il y a ${Math.floor(dateMinute)} minutes`
        } else {
            return `Il y a ${Math.floor(dateMinute)} minute`
        }
        
    } else if (dateHour < 24) {
        if (Math.floor(dateHour) > 1) {
            return `Il y a ${Math.floor(dateHour)} heures`
        } else {
            return `Il y a ${Math.floor(dateHour)} heure`
        }
        
    } else {
        if (Math.floor(dateDay) > 1) {
            return `Il y a ${Math.floor(dateDay)} jours`
        } else  {
            return `Il y a ${Math.floor(dateDay)} jour`
        }
        
    }
}

const Feed = ({search}) => {

    const [input, setInput] = useState("")
    const [posts, setPosts] = useState([])
    const [editingPostId, setEditingPostId] = useState(null)

    const inputRef = useRef(null)

    const fetchPosts = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:5000/posts", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!response.ok) {
                throw new Error(`Erreur serveur: ${response.status}`)
            }
            const data = await response.json()

            const sortByDate = [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            setPosts(sortByDate)
        } catch(err) {
            console.error(`Fetch échoué: ${err}`)
        }
    }

    const handleSubmitPost = async () => {
        let data
        try {
            if (input.trim() === "") return
            if (editingPostId !== null) {
                const token = localStorage.getItem("token")
                const response = await fetch(`http://localhost:5000/posts/${editingPostId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({content: input})
                })
                if (!response.ok) {
                    throw new Error(`Erreur serveur: ${response.status}`)
                }
                const data = await response.json()
                setPosts(prevPosts => prevPosts.map(post => post._id === editingPostId ? data.updatedPost : post))
                setEditingPostId(null)
            } else {
                const token = localStorage.getItem("token")
                const pseudo = localStorage.getItem("pseudo")
                const response = await fetch("http://localhost:5000/posts", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({pseudo, content: input})
                })
                if (!response.ok) {
                    throw new Error(`Erreur serveur: ${response.status}`)
                }

                if (input.length > 10) {

                }

                const data = await response.json()
                setPosts(prevPosts => [...prevPosts, data])
            }
            setInput("")
        } catch(err) {
            console.error("fetch échoué", err)
        }
    }

    const handleDeletePost = async (postToDelete) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:5000/posts/${postToDelete}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!response.ok) {
                throw new Error(`Erreur serveur: ${response.status}`)
            }
            const data = await response.json()
            setPosts(prevPosts => prevPosts.filter(post => post._id !== postToDelete))
        } catch(err) {
            console.error("fetch échoué", err)
        }
    }

    const handleEditPost = (post) => {
        setEditingPostId(post._id)
        setInput(post.content)
        inputRef.current.focus()
    }

    const handleLikes = async (postId) => {
        try {
            const token =  localStorage.getItem("token")
            const response = await fetch(`http://localhost:5000/posts/${postId}/likes`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!response.ok) {
                throw new Error(`Erreur serveur: ${response.status}`)
            }
            const data = await response.json()
            setPosts(prevPosts => prevPosts.map(post => {
                return postId === post._id ? data.updatedLikes : post
            }))
        } catch(err) {
            console.error("Fetch likes échoué", err)
        }
    }

    useEffect(() => {
        fetchPosts()
        inputRef.current.focus()
    }, [])

    return (
        <div>
            <nav className="tabs">
                <button className="tab">Pour vous</button>
                <button className="tab active">Abonnement</button>
            </nav>
            <div className="newPost">
                <input className="inputPost" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Quoi de neuf ?" ref={inputRef} onKeyDown={(e) => {if (e.key === "Enter") {handleSubmitPost()} else if (e.key === "Escape") {setEditingPostId(null), setInput("")}
                }}  />
                {input.length > 0 ? <button className="addPostBtn" onClick={handleSubmitPost} disabled={input.length > 10} >{editingPostId ? "Editer" : "Poster"}</button> : <button className="addPostBtn" onClick={handleSubmitPost} disabled={input.length > 10} style={{backgroundColor: "grey"}} >{editingPostId ? "Editer" : "Poster"}</button> }
                {input.length > 10 ? <p style={{color: "red"}}>{280 - input.length}</p> : <p>{280 - input.length}</p>}
            </div>
            <div className="posts">
                <ul className="liste">
                    {posts.map(post => {
                        const currentUserId = localStorage.getItem("userId")
                        const hasLiked = post.likes?.includes(currentUserId)
                        return (
                            <li className="post" key={post._id}> {post.pseudo} {post.content} <button onClick={() => handleLikes(post._id)} >{hasLiked ? "Unlike" : "Liker"}</button> <p>{post.likes ? post.likes.length : 0}</p> <button onClick={() => handleEditPost(post)}>Editer</button><button onClick={() => handleDeletePost(post._id)}>Supprimer</button><p></p>
                            <p>{dateFromNow(post.createdAt)}</p></li>
                        )
                    })
                    }
                </ul>
            </div>
            
        </div>
    )
}

export default Feed