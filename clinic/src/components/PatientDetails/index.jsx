import React, { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import apiClient from '../../api/api'

const formatDateValue = (value) => {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

const toDateTimeLocalValue = (value) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (number) => String(number).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const toISOStringValue = (value) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toISOString()
}

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload?.data?.exames)) return payload.data.exames
  if (Array.isArray(payload?.data?.consultas)) return payload.data.consultas
  if (Array.isArray(payload?.exames)) return payload.exames
  if (Array.isArray(payload?.consultas)) return payload.consultas

  return []
}

const PatientDetails = () => {
  const { id } = useParams()
  const { isDarkMode } = useOutletContext() || { isDarkMode: false }
  const [patient, setPatient] = useState(null)
  const [consults, setConsults] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  const [editingConsult, setEditingConsult] = useState(null)
  const [editConsultData, setEditConsultData] = useState({
    motivo: '',
    data_consulta: '',
    observacoes: '',
    medico_responsavel_id: '',
  })
  const [isEditingConsult, setIsEditingConsult] = useState(false)

  const [editingExam, setEditingExam] = useState(null)
  const [editExamData, setEditExamData] = useState({
    tipo_exame: '',
    valor: '',
    descricao: '',
    resultado: '',
    data_exame: '',
  })
  const [isEditingExam, setIsEditingExam] = useState(false)

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setLoading(true)

        const patientRes = await apiClient.get(`/pacientes/${id}`)
        const consultsRes = await apiClient.get('/consultas')
        const examsRes = await apiClient.get('/exames')

        const patientData = patientRes.data?.data ?? patientRes.data
        const consultsPayload = normalizeList(consultsRes.data)
        const examsPayload = normalizeList(examsRes.data)

        setPatient(patientData)
        setConsults(consultsPayload.filter((consult) => Number(consult?.paciente_id) === Number(id)))
        setExams(examsPayload.filter((exam) => Number(exam?.pacienteId) === Number(id)))
      } catch (error) {
        console.error('Erro ao obter os detalhes do paciente:', error)
        toast.error('Não foi possível carregar os detalhes do paciente.')
      } finally {
        setLoading(false)
      }
    }

    fetchPatientDetails()
  }, [id])

  const handleEditConsult = (consult) => {
    setEditingConsult(consult)
    setEditConsultData({
      motivo: consult.motivo || '',
      data_consulta: toDateTimeLocalValue(consult.data_consulta),
      observacoes: consult.observacoes || '',
      medico_responsavel_id: consult.medico_responsavel_id ?? '',
    })
    setIsEditingConsult(true)
  }

  const handleUpdateConsult = async (e) => {
    e.preventDefault()
    try {
      if (!editingConsult) return

      const updatedConsult = {
        ...editingConsult,
        ...editConsultData,
        data_consulta: toISOStringValue(editConsultData.data_consulta),
        paciente_id: Number(id),
        medico_responsavel_id: Number(editConsultData.medico_responsavel_id || editingConsult.medico_responsavel_id || 0),
      }

      await apiClient.put(`/consultas/${editingConsult.id}`, updatedConsult)
      setConsults((prev) =>
        prev.map((consult) => (consult.id === editingConsult.id ? updatedConsult : consult))
      )

      toast.success('Consulta atualizada com sucesso!')
      setIsEditingConsult(false)
      setEditingConsult(null)
    } catch (error) {
      console.error('Erro ao atualizar a consulta:', error)
      toast.error(error?.response?.data?.message || 'Erro ao atualizar a consulta!')
    }
  }

  const handleDeleteConsult = async (consultId) => {
    try {
      await apiClient.delete(`/consultas/${consultId}`)
      setConsults((prev) => prev.filter((consult) => consult.id !== consultId))
      toast.success('Consulta excluída com sucesso!')
    } catch {
      toast.error('Erro ao excluir consulta!')
    }
  }

  const handleEditExam = (exam) => {
    setEditingExam(exam)
    setEditExamData({
      tipo_exame: exam.tipo_exame || '',
      valor: exam.valor ?? '',
      descricao: exam.descricao || '',
      resultado: exam.resultado || '',
      data_exame: toDateTimeLocalValue(exam.data_exame),
    })
    setIsEditingExam(true)
  }

  const handleUpdateExam = async (e) => {
    e.preventDefault()
    try {
      if (!editingExam) return

      const updatedExam = {
        ...editingExam,
        ...editExamData,
        data_exame: toISOStringValue(editExamData.data_exame),
        pacienteId: Number(id),
        valor: Number(editExamData.valor || editingExam.valor || 0),
      }

      await apiClient.put(`/exames/${editingExam.id}`, updatedExam)
      setExams((prev) =>
        prev.map((exam) => (exam.id === editingExam.id ? updatedExam : exam))
      )

      toast.success('Exame atualizado com sucesso!')
      setIsEditingExam(false)
      setEditingExam(null)
    } catch (error) {
      console.error('Erro ao atualizar o exame:', error)
      toast.error(error?.response?.data?.message || 'Erro ao atualizar o exame!')
    }
  }

  const handleDeleteExam = async (examId) => {
    try {
      await apiClient.delete(`/exames/${examId}`)
      setExams((prev) => prev.filter((exam) => exam.id !== examId))
      toast.success('Exame excluído com sucesso!')
    } catch {
      toast.error('Erro ao excluir exame!')
    }
  }

  const handleExportPdf = () => {
    if (!patient) return

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      toast.error('Seu navegador bloqueou a abertura da janela de impressão.')
      return
    }

    const consultsMarkup = consults.length
      ? consults.map((consult) => `
          <div class="card">
            <p><strong>Motivo:</strong> ${consult.motivo || '-'}</p>
            <p><strong>Data:</strong> ${formatDateValue(consult.data_consulta)}</p>
            <p><strong>Observações:</strong> ${consult.observacoes || '-'}</p>
            <p><strong>Médico responsável:</strong> ${consult.medico_responsavel_id || '-'}</p>
          </div>
        `).join('')
      : '<p>Nenhuma consulta registrada.</p>'

    const examsMarkup = exams.length
      ? exams.map((exam) => `
          <div class="card">
            <p><strong>Tipo:</strong> ${exam.tipo_exame || '-'}</p>
            <p><strong>Valor:</strong> ${exam.valor ?? '-'}</p>
            <p><strong>Descrição:</strong> ${exam.descricao || '-'}</p>
            <p><strong>Resultado:</strong> ${exam.resultado || '-'}</p>
            <p><strong>Data:</strong> ${formatDateValue(exam.data_exame)}</p>
          </div>
        `).join('')
      : '<p>Nenhum exame registrado.</p>'

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prontuário - ${patient.nome || 'Paciente'}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
            h1, h2 { color: #0f172a; }
            .section { margin-top: 24px; }
            .card { border: 1px solid #d1d5db; border-radius: 8px; padding: 12px; margin-bottom: 10px; }
            p { margin: 4px 0; }
          </style>
        </head>
        <body>
          <h1>Prontuário do paciente</h1>
          <p><strong>Nome:</strong> ${patient.nome || '-'}</p>
          <p><strong>CPF:</strong> ${patient.cpf || '-'}</p>
          <p><strong>Telefone:</strong> ${patient.telefone || '-'}</p>
          <p><strong>E-mail:</strong> ${patient.email || '-'}</p>
          <p><strong>Data de nascimento:</strong> ${patient.data_nascimento ? formatDateValue(patient.data_nascimento) : '-'}</p>
          <p><strong>Sexo:</strong> ${patient.sexo || '-'}</p>
          <p><strong>Responsável:</strong> ${patient.responsavel || 'Não informado'}</p>

          <div class="section">
            <h2>Consultas</h2>
            ${consultsMarkup}
          </div>

          <div class="section">
            <h2>Exames</h2>
            ${examsMarkup}
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  if (loading) return <p className={`p-6 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Carregando...</p>
  if (!patient) return <p className={`p-6 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>Paciente não encontrado.</p>

  return (
    <section className={`p-6 max-w-5xl mx-auto ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
      <div className={`rounded-2xl shadow-md p-6 mb-8 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-4">
          <div>
            <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>{patient.nome}</h2>
            <p><span className="font-semibold">CPF:</span> {patient.cpf || '-'}</p>
            <p><span className="font-semibold">Telefone:</span> {patient.telefone || '-'}</p>
            <p><span className="font-semibold">E-mail:</span> {patient.email || '-'}</p>
            <p><span className="font-semibold">Data de nascimento:</span> {patient.data_nascimento ? formatDateValue(patient.data_nascimento) : '-'}</p>
            <p><span className="font-semibold">Sexo:</span> {patient.sexo || '-'}</p>
            <p><span className="font-semibold">Responsável:</span> {patient.responsavel || 'Não informado'}</p>
          </div>
          <button
            type="button"
            onClick={handleExportPdf}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Exportar PDF do prontuário
          </button>
        </div>
      </div>

      <div className={`rounded-2xl shadow-md p-6 mb-8 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-slate-100' : 'text-gray-700'}`}>Histórico de Consultas</h3>

        {isEditingConsult ? (
          <form onSubmit={handleUpdateConsult} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Motivo</label>
              <input
                value={editConsultData.motivo}
                onChange={(e) => setEditConsultData({ ...editConsultData, motivo: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Data da consulta</label>
              <input
                type="datetime-local"
                value={editConsultData.data_consulta}
                onChange={(e) => setEditConsultData({ ...editConsultData, data_consulta: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Observações</label>
              <textarea
                value={editConsultData.observacoes}
                onChange={(e) => setEditConsultData({ ...editConsultData, observacoes: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                rows="3"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Médico responsável</label>
              <input
                type="number"
                value={editConsultData.medico_responsavel_id}
                onChange={(e) => setEditConsultData({ ...editConsultData, medico_responsavel_id: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition cursor-pointer">Salvar</button>
              <button type="button" onClick={() => setIsEditingConsult(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition cursor-pointer">Cancelar</button>
            </div>
          </form>
        ) : consults.length === 0 ? (
          <p className={`text-gray-500 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Nenhuma consulta encontrada.</p>
        ) : (
          consults.map((consult) => (
            <div key={consult.id} className={`border rounded-xl p-4 mb-4 transition ${isDarkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
              <p><strong>Motivo:</strong> {consult.motivo}</p>
              <p><strong>Data:</strong> {formatDateValue(consult.data_consulta)}</p>
              <p><strong>Observações:</strong> {consult.observacoes}</p>
              <p><strong>Médico responsável:</strong> {consult.medico_responsavel_id}</p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => handleEditConsult(consult)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer">Editar</button>
                <button onClick={() => handleDeleteConsult(consult.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer">Deletar</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={`rounded-2xl shadow-md p-6 border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-slate-100' : 'text-gray-700'}`}>Histórico de Exames</h3>

        {isEditingExam ? (
          <form onSubmit={handleUpdateExam} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Tipo de exame</label>
              <input
                value={editExamData.tipo_exame}
                onChange={(e) => setEditExamData({ ...editExamData, tipo_exame: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Valor</label>
              <input
                type="number"
                step="0.01"
                value={editExamData.valor}
                onChange={(e) => setEditExamData({ ...editExamData, valor: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Descrição</label>
              <textarea
                value={editExamData.descricao}
                onChange={(e) => setEditExamData({ ...editExamData, descricao: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                rows="3"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Resultado</label>
              <textarea
                value={editExamData.resultado}
                onChange={(e) => setEditExamData({ ...editExamData, resultado: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                rows="3"
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Data do exame</label>
              <input
                type="datetime-local"
                value={editExamData.data_exame}
                onChange={(e) => setEditExamData({ ...editExamData, data_exame: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">Salvar</button>
              <button type="button" onClick={() => setIsEditingExam(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">Cancelar</button>
            </div>
          </form>
        ) : exams.length === 0 ? (
          <p className={`text-gray-500 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Nenhum exame encontrado.</p>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className={`border rounded-xl p-4 mb-4 transition ${isDarkMode ? 'bg-slate-700 border-slate-600 hover:bg-slate-600' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
              <p><strong>Tipo:</strong> {exam.tipo_exame}</p>
              <p><strong>Valor:</strong> {exam.valor}</p>
              <p><strong>Descrição:</strong> {exam.descricao}</p>
              <p><strong>Resultado:</strong> {exam.resultado}</p>
              <p><strong>Data:</strong> {formatDateValue(exam.data_exame)}</p>
              <div className="flex gap-3 mt-3">
                <button onClick={() => handleEditExam(exam)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer">Editar</button>
                <button onClick={() => handleDeleteExam(exam.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer">Deletar</button>
              </div>
            </div>
          ))
        )}
      </div>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </section>
  )
}

export default PatientDetails
