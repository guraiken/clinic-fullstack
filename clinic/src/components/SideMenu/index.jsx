import { NavLink, useNavigate } from "react-router";
import {
    MdDashboard,
    MdExitToApp,
    MdMenu,
    MdClose
} from 'react-icons/md'

import { 
    FaUserPlus,
    FaListAlt,
    FaCalendarCheck
} from 'react-icons/fa'

import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

export const SideMenu = ({ isDarkMode, onToggleTheme }) => {
    const navigate = useNavigate()
    const { logout } = useAuth();

    // controle do menu lateral (aberto ou fechado)
    const [isCollapsed, setIsCollapsed] = useState(false)

    // função logout

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    //função toggle menu

    const toggleMenu = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <aside className={`h-screen ${isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-cyan-800 text-white'} flex flex-col justify-between transition-all duration-300 ${isCollapsed ? 'w-20 items-center' : 'w-64'}`}>
            <div className={`p-4 flex items-center justify-between border-b ${isDarkMode ? 'border-slate-700' : 'border-cyan-700'}`}>
                { !isCollapsed && (
                    <h1 className="text-lg font-bold">Clínica +</h1>
                ) 
            }
            <button onClick={toggleMenu} className="cursor-pointer">
                {isCollapsed ? <MdMenu size={24}/> : <MdClose size={24}/>}
            </button>
            </div>

            {/* MENU */}
            <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
                <ul className="space-y-3">
                    <li>
                        <NavLink to="/dashboard" className={({isActive}) => 
                            isActive ? `${isDarkMode ? 'text-cyan-400' : 'text-cyan-300'} flex gap-2` : `flex items-center gap-3 ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-300'}`
                        }>
                            <MdDashboard size={20}/>
                            {!isCollapsed && <span>Início</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/pacientes" className={({isActive}) => 
                            isActive ? `${isDarkMode ? 'text-cyan-400' : 'text-cyan-300'} flex gap-2` : `flex items-center gap-3 ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-300'}`
                        }>
                            <FaUserPlus size={20}/>
                            {!isCollapsed && <span>Registrar Paciente</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/consultas" className={({isActive}) => 
                            isActive ? `${isDarkMode ? 'text-cyan-400' : 'text-cyan-300'} flex gap-2` : `flex items-center gap-3 ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-300'}`
                        }
                        >
                            <FaCalendarCheck size={20}/>
                            {!isCollapsed && <span>Consultas</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/exams" className={({isActive}) => 
                            isActive ? `${isDarkMode ? 'text-cyan-400' : 'text-cyan-300'} flex gap-2` : `flex items-center gap-3 ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-300'}`
                        }>
                            <FaListAlt size={20}/>
                            {!isCollapsed && <span>Exames</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/prontuarios" className={({isActive}) => 
                            isActive ? `${isDarkMode ? 'text-cyan-400' : 'text-cyan-300'} flex gap-2` : `flex items-center gap-3 ${isDarkMode ? 'hover:text-cyan-400' : 'hover:text-cyan-300'}`
                        }>
                            <FaListAlt size={20}/>
                            {!isCollapsed && <span>Prontuários</span>}
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* botao de sair  */}

            <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-cyan-700'}`}>
                <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-red-300 hover:text-red-500 w-full cursor-pointer"
                >
                    <MdExitToApp size={20}/>
                    {!isCollapsed && <span>Sair</span>}
                </button>
            </div>

        </aside>
    )
}
