import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useOutletContext } from "react-router";

export const useIsAdmin = () => { 
    const { user } = useAuth()

    return user?.role === "ADMIN"
} 