import { useState, useEffect } from "react"
import { FaHospitalUser } from "react-icons/fa"
import apiClient from "../../../api/api"

export const PatientCounter = ({ isDarkMode = false }) => {
    const [patientCounter, setPatientCounter] = useState(0)

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await apiClient.get("/pacientes")
                const data = response?.data?.data?.pacientes ?? response?.data?.data ?? response?.data ?? []
                setPatientCounter(Array.isArray(data) ? data.length : 0)
            } catch (error) {
                console.error("Erro ao obter dados dos pacientes", error)
            }
        }
        fetchPatients()
    }, [])

    return (
        <div className={`p-6 shadow rounded-lg flex flex-col items-center w-60 border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-transparent text-gray-900'}`}>
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
                <FaHospitalUser size={20} className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'} />
                {patientCounter}
            </h2>
            {patientCounter && <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Pacientes</p>}
        </div>
    )
}
