import { useState, useEffect } from "react"
import { BsClipboard2PulseFill } from "react-icons/bs"
import apiClient from "../../../api/api"

export const ExamCounter = ({ isDarkMode = false }) => {
    const [examCounter, setExamCounter] = useState(0)

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await apiClient.get("/exames")
                const data = response?.data?.data ?? response?.data ?? []
                setExamCounter(Array.isArray(data) ? data.length : 0)
            } catch (error) {
                console.error("Erro ao obter dados dos exames", error)
            }
        }
        fetchPatients()
    }, [])

    return (
        <div className={`p-6 shadow rounded-lg flex flex-col items-center w-60 border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-transparent text-gray-900'}`}>
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                <BsClipboard2PulseFill size={20} className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'} />
                {examCounter}
            </h2>
            {examCounter && <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Exames</p>}
        </div>
    )
}
