import { useEffect, useState } from "react"
import { Outlet } from "react-router"
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import { useAuth } from "../contexts/AuthContext"
import { SideMenu } from "../components/SideMenu"

function DashboardLayout() {
    const {user, logout} = useAuth()
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window === 'undefined') return false
        return localStorage.getItem('theme') === 'dark'
    })

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode)
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
    }, [isDarkMode])

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev)
    }

    return (
        <div className={`flex min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-100 text-gray-900'}`}>
            {/* barra lateral menu */}
            <SideMenu isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
            {/* Conteúdo principal */}
            <main className="flex-1 flex flex-col">
                <header className={`flex items-center justify-between gap-4 p-4 shadow ${isDarkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-cyan-800'}`}>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold">Painel do Sistema</h1>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className={`rounded-full p-2 transition cursor-pointer ${isDarkMode ? 'bg-slate-700 text-yellow-300' : 'bg-cyan-100 text-cyan-700'}`}
                            title={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
                        >
                            {isDarkMode ? <MdLightMode size={18} /> : <MdDarkMode size={18} />}
                        </button>
                    </div>

                    {user && (
                        <div className="flex items-center gap-4 ml-auto">
                            <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Bem vindo {user?.email}</span>
                            <button 
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
                                onClick={logout}
                            >
                                Sair
                            </button>
                        </div>
                    )}
                </header>
                <section className={`flex-1 p-6 overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-gray-100 text-gray-900'}`}>
                    <Outlet context={{ isDarkMode }} />
                </section>
            </main>
        </div>
    )
}

export default DashboardLayout