import { useIsAdmin } from "../../../hooks/isAdmin"
import { useOutletContext } from "react-router";

export const RestrictedAdmin = () => {
    const isAdmin  = useIsAdmin()
    const { isDarkMode } = useOutletContext()

    if (isAdmin) return null

    return (
        <div>
            <p className={`text-center py-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                <strong className="text-red-400">Acesso restrito</strong>, usuário não é administrador
            </p>
        </div>
    )
}

export default RestrictedAdmin