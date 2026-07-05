import { useState, useEffect, useCallback } from "react"
import { FaUserAlt } from "react-icons/fa"
import { Link } from "react-router"
import apiClient from "../../api/api"
import { useAuth } from "../../contexts/AuthContext"

export const PatientsList = ({ isDarkMode = false }) => {
  const [patients, setPatients] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [ages, setAges] = useState({})
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 4,
  })

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

  // 1. CORREÇÃO: Agora a função recebe o 'currentSearch' explicitamente para evitar closures atrasadas
  const fetchPatients = useCallback(async (page = 1, limit = 4, isBlurSearch = false, currentSearch = "") => {
    try {
      if (!user || user.role !== "ADMIN") {
        setIsAdmin(false)
        setPatients([])
        return
      }
      setIsAdmin(true)

      const hasSearchTerm = currentSearch.trim().length > 0
      const shouldFetchAll = isBlurSearch && hasSearchTerm
      const url = shouldFetchAll ? `/pacientes` : `/pacientes?pagina=${page}&limite=${limit}`

      const response = await apiClient.get(url)
      const patientsData = response?.data?.data?.pacientes ?? []

      const calculatedAges = {}
      patientsData.forEach((p) => {
        calculatedAges[p.id] = calculateAge(p.data_nascimento)
      })

      setAges(calculatedAges)
      setPatients(patientsData)

      setPagination({
        total: response?.data?.data?.total ?? (shouldFetchAll ? patientsData.length : 0),
        totalPages: shouldFetchAll ? 1 : (response?.data?.data?.totalPaginas ?? 1),
        page: shouldFetchAll ? 1 : page,
        limit: shouldFetchAll ? 0 : limit,
      })
    } catch (error) {
      console.error("Erro ao obter dados dos pacientes", error)
    }
  }, [user]) // Removido searchTerm das dependências para evitar loops

  // 2. Dispara a busca padrão quando a página mudar (apenas se o input estiver vazio)
  useEffect(() => {
    if (!searchTerm.trim()) {
      fetchPatients(pagination.page, pagination.limit, false, "")
    }
  }, [pagination.page, pagination.limit, fetchPatients])

  // 3. Função para mudar de página controlada pelos botões
  const handlePageChange = (targetPage) => {
    if (targetPage < 1 || targetPage > pagination.totalPages) return
    setPagination(prev => ({ ...prev, page: targetPage }))
  }

  // 4. CORREÇÃO: Passa a string limpa diretamente para forçar a paginação correta na API imediatamente
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (!value.trim()) {
      fetchPatients(1, 4, false, "")
    }
  }

  // 5. CORREÇÃO: Proteção total contra o campo vazio no Blur
  const handleSearchBlur = (e) => {
    const value = e.target.value
    if (!value.trim()) return

    fetchPatients(1, 4, true, value)
  }

  // O filtro local continua ativo enquanto o usuário digita
  const filteredPatients = patients.filter((patient) =>
    [patient?.nome, patient?.email, patient?.telefone]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div
      className={`shadow rounded-2xl p-6 mt-8 border ${isDarkMode
        ? "bg-slate-800 border-slate-700 text-slate-100"
        : "bg-white border-transparent text-gray-900"
        }`}
    >
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? "text-slate-100" : "text-cyan-800"}`}>
        Informações Rápidas de Pacientes
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <label htmlFor="search" className={`font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
          Buscar Paciente:
        </label>
        <div className="flex gap-3 w-full sm:w-auto">
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
            placeholder="Digite o nome, email ou telefone"
            className={`border rounded-lg px-3 py-2 w-full sm:w-80 focus:ring-2 focus:ring-cyan-600 outline-none ${isDarkMode
              ? "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
              : "bg-white border-gray-300 text-gray-900"
              }`}
          />
        </div>
      </div>

      {isAdmin ? (
        <>
          {pagination.totalPages > 1 && (
            <div
              className={`flex items-center justify-between mt-4 mb-4 gap-4 ${isDarkMode ? "text-slate-200" : "text-gray-800"
                }`}
            >
              <div className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
                Página <strong>{pagination.page}</strong> de <strong>{pagination.totalPages}</strong> (Total: {pagination.total})
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className={`px-3 py-1.5 rounded-lg border ${pagination.page === 1 ? "cursor-not-allowed" : "cursor-pointer"}  ${isDarkMode
                    ? "border-slate-600 bg-slate-700 text-slate-100 disabled:opacity-50"
                    : "border-gray-300 bg-white text-gray-800 disabled:opacity-50"
                    }`}
                >
                  Anterior
                </button>

                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className={`px-3 py-1.5 rounded-lg border ${pagination.page >= pagination.totalPages ? "cursor-not-allowed" : "cursor-pointer"}  ${isDarkMode
                    ? "border-slate-600 bg-slate-700 text-slate-100 disabled:opacity-50"
                    : "border-gray-300 bg-white text-gray-800 disabled:opacity-50"
                    }`}
                >
                  Próxima
                </button>
              </div>
            </div>
          )}

          {filteredPatients.length > 0 ? (
            <ul className={`divide-y ${isDarkMode ? "divide-slate-700" : "divide-gray-200"}`}>
              {filteredPatients.map((patient) => (
                <li key={patient?.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isDarkMode ? "bg-slate-700 text-cyan-300" : "bg-cyan-100 text-cyan-700"}`}>
                      <FaUserAlt size={20} />
                    </div>
                    <div>
                      <p className={`font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}>{patient?.nome}</p>
                      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>{patient?.email}</p>
                      <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>{patient?.telefone}</p>
                    </div>
                  </div>

                  <div className={`text-sm mt-2 sm:mt-0 text-right ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
                    <p>
                      <strong>Idade:</strong> {ages[patient?.id] || "-"} anos
                    </p>
                    <Link
                      to={`/paciente/${patient?.id}`}
                      className={`font-semibold hover:underline ${isDarkMode ? "text-cyan-400" : "text-cyan-700"}`}
                    >
                      Ver detalhes
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`text-center py-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Nenhum paciente encontrado</p>
          )}
        </>
      ) : (
        <p className={`text-center py-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
          <strong className="text-red-400">Acesso restrito</strong>, usuário não é administrador
        </p>
      )}
    </div>
  )
}