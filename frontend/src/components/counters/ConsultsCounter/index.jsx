import { useState, useEffect } from "react"
import { FaCalendarDays } from "react-icons/fa6"
import apiClient from "../../../api/api"

export const ConsultsCounter = ({ isDarkMode = false }) => {
    const [consultsCounter, setConsultsCounter] = useState(0)

    useEffect(() => {
        const fetchConsults = async () => {
            try {
                const response = await apiClient.get("/consultas")
                const data = response?.data?.data ?? response?.data ?? []
                setConsultsCounter(Array.isArray(data) ? data.length : 0)
            } catch (error) {
                console.error("Erro ao obter dados das consultas", error)
            }
        }
        fetchConsults()
    }, [])

    return (
        <div className={`p-6 shadow rounded-lg flex flex-col items-center w-60 border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-transparent text-gray-900'}`}>
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                <FaCalendarDays size={20} className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'} />
                {consultsCounter}
            </h2>
            {consultsCounter && <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Consultas</p>}
        </div>
    )
}
