import { useState, useEffect } from "react"
import { FaUserAlt } from "react-icons/fa"
import { Link } from "react-router"
import apiClient from "../../api/api"

export const PatientsList = ({ isDarkMode = false }) => {
    const [patients, setPatients] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [ages, setAges] = useState({})

    const calculateAge = (birthdate) => {
        if (!birthdate) return "-"
        const today = new Date()
        const birthdateDate = new Date(birthdate)
        let age = today.getFullYear() - birthdateDate.getFullYear()
        const monthDiff = today.getMonth() - birthdateDate.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateDate.getDate())) {
            age--
        }

        return age
    }

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await apiClient.get("/pacientes")
                const patientsData = response?.data?.data?.pacientes ?? response?.data?.data ?? []

                const calculatedAges = {}
                patientsData.forEach((patient) => {
                    calculatedAges[patient.id] = calculateAge(patient.data_nascimento)
                })
                setAges(calculatedAges)
                setPatients(patientsData)
            } catch (error) {
                console.error("Erro ao obter dados dos pacientes", error)
            }
        }
        fetchPatients()
    }, [])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const filteredPatients = patients.filter((patient) =>
        [patient?.nome, patient?.email, patient?.telefone]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    )

    return (
        <div className={`shadow rounded-2xl p-6 mt-8 border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-transparent text-gray-900'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-slate-100' : 'text-cyan-800'}`}>
                Informações Rápidas de Pacientes
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <label htmlFor="search" className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Buscar Paciente:
                </label>
                <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Digite o nome, email ou telefone"
                    className={`border rounded-lg px-3 py-2 w-full sm:w-80 focus:ring-2 focus:ring-cyan-600 outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400' : 'bg-white border-gray-300 text-gray-900'}`}
                />
            </div>

            {filteredPatients.length > 0 ? (
                <ul className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-200'}`}>
                    {filteredPatients.map((patient) => (
                        <li
                            key={patient?.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between py-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-slate-700 text-cyan-300' : 'bg-cyan-100 text-cyan-700'}`}>
                                    <FaUserAlt size={20} />
                                </div>
                                <div>
                                    <p className={`font-semibold ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>{patient?.nome}</p>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{patient?.email}</p>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{patient?.telefone}</p>
                                </div>
                            </div>

                            <div className={`text-sm mt-2 sm:mt-0 text-right ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                                <p><strong>Idade:</strong> {ages[patient?.id] || '-'} anos</p>
                                <Link
                                    to={`/paciente/${patient?.id}`}
                                    className={`font-semibold hover:underline ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}
                                >
                                    Ver detalhes
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className={`text-center py-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Nenhum paciente encontrado</p>
            )}
        </div>
    )
}
