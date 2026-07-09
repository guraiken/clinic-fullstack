import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export const useIsAdmin = () => {
    const { user } = useAuth()

    return () => user?.roles === "ADMIN"
} 