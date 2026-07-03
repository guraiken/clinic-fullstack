import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser))
                return
            } catch {
                localStorage.removeItem("user")
            }
        }

        const savedEmail = localStorage.getItem("email")
        if (savedEmail) {
            setUser({ email: savedEmail })
        }
    }, [])

    const login = (email, role) => {
        const userData = { email, role }
        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("email", email)
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem("email")
        localStorage.removeItem("user")
        localStorage.removeItem("theme")
        setUser(null)
        if (typeof document !== "undefined") {
            document.documentElement.classList.remove("dark")
        }
    }

    const isAdmin = user && String(user.role).toUpperCase() === "ADMIN"

    return (
        <AuthContext.Provider
            value={{user, logout, login, isAdmin}}
        >   
          {children}
        </AuthContext.Provider>
    )
}

//hook custom pra consumo do contexto

export const useAuth = () => useContext(AuthContext)

