import React, { useState, useEffect, useCallback, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useOutletContext } from "react-router";

import { Modal } from "../Modal";
import apiClient from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const buildConsultPayload = (selectedPatient, formData) => {
  const dataConsulta =
    formData.date && formData.time
      ? new Date(`${formData.date}T${formData.time}`).toISOString()
      : "";

  const observacoes = [
    formData.description,
    formData.medication && `Medicação: ${formData.medication}`,
    formData.dosagePrecautions && `Dosagem e Precauções: ${formData.dosagePrecautions}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    motivo: formData.reason,
    data_consulta: dataConsulta,
    observacoes,
    paciente_id: selectedPatient.id,
    medico_responsavel_id: Number(formData.medico_responsavel_id),
  };
};

function ConsultationForm() {
  const { isDarkMode } = useOutletContext() || { isDarkMode: false };
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const debounceTimeoutRef = useRef(null);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 4,
  });

  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    time: "",
    description: "",
    medication: "",
    dosagePrecautions: "",
    medico_responsavel_id: "",
  });

  // Função centralizada e limpa para buscar dados da API
  const fetchPatients = useCallback(async (page = 1, limit = 4, isBlurSearch = false, currentSearch = "") => {
    try {
      if (!user || user.role !== "ADMIN") {
        setIsAdmin(false);
        setPatients([]);
        return;
      }

      setIsAdmin(true);

      const hasSearchTerm = currentSearch.trim().length > 0;
      const shouldFetchAll = isBlurSearch && hasSearchTerm;
      const url = shouldFetchAll ? "/pacientes" : `/pacientes?pagina=${page}&limite=${limit}`;

      const response = await apiClient.get(url);
      const patientsData = response?.data?.data?.pacientes ?? [];

      setPatients(patientsData);

      setPagination({
        total: response?.data?.data?.total ?? (shouldFetchAll ? patientsData.length : 0),
        totalPages: shouldFetchAll ? 1 : (response?.data?.data?.totalPaginas ?? 1),
        page: shouldFetchAll ? 1 : page,
        limit: shouldFetchAll ? 0 : limit,
      });
    } catch (error) {
      console.error("Erro ao obter dados dos pacientes", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 1. CORREÇÃO: Esse efeito dispara APENAS se o campo de busca estiver completamente vazio.
  // Evita conflito com o estado "carregando" enquanto você digita.
  useEffect(() => {
    if (!searchTerm.trim()) {
      setLoading(true);
      fetchPatients(pagination.page, pagination.limit, false, "");
    }
  }, [pagination.page, pagination.limit, fetchPatients]);

  // 2. CORREÇÃO: Função handleSearchChange redesenhada com Debounce seguro.
  // Ela limpa o estado de loading caso o usuário apague o texto.
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (!value.trim()) {
      // Se o input foi limpo, reseta imediatamente para a página 1 padrão da API
      setLoading(true);
      fetchPatients(1, 4, false, "");
      return;
    }

    // Ativa o feedback visual de carregamento
    setLoading(true);

    // Aguarda 600ms após a última tecla para disparar a busca em lote (semelhante ao onBlur antigo, mas automático)
    debounceTimeoutRef.current = setTimeout(() => {
      fetchPatients(1, 4, true, value);
    }, 600);
  };

  // Limpeza de memória do timer
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  // 3. CORREÇÃO: Mantemos o filtro local ativo sobre o que quer que venha da API.
  // Isso garante que se a API trouxer os dados, o filtro exibe em tempo real as letras correspondentes.
  const filteredPatients = patients.filter((patient) =>
    [patient?.nome, patient?.email, patient?.telefone, patient?.id?.toString()]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (targetPage) => {
    if (targetPage < 1 || targetPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: targetPage }));
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      reason: "",
      date: "",
      time: "",
      description: "",
      medication: "",
      dosagePrecautions: "",
      medico_responsavel_id: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      setIsSaving(true);

      const payload = buildConsultPayload(selectedPatient, formData);
      const response = await apiClient.post("/consultas", payload);

      toast.success(response?.data?.message || "Consulta cadastrada com sucesso!", {
        autoClose: 3000,
        hideProgressBar: false,
      });

      resetForm();
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao cadastrar consulta!", error);
      const errorMessage = error?.response?.data?.message || "Erro ao cadastrar consulta!";
      toast.error(errorMessage, { autoClose: 3000, hideProgressBar: false });
    } finally {
      setIsSaving(false);
    }
  };

  const labelClass = `block text-sm font-semibold mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`;
  const inputClass = `w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none ${isDarkMode
      ? "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
      : "bg-white border-gray-300 text-gray-900"
    }`;

  return (
    <section className={isDarkMode ? "text-slate-100" : "text-gray-800"}>
      <ToastContainer position="top-right" autoClose={3000} theme={isDarkMode ? "dark" : "light"} />
      <h1 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-slate-100" : "text-cyan-800"}`}>
        Cadastro de Consultas
      </h1>

      <div className={`p-6 rounded-2xl shadow border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-transparent"}`}>
        <div className="mb-6">
          <label className={labelClass}>Buscar paciente para cadastrar a consulta</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Digite o nome, email, telefone ou registro do paciente"
            className={inputClass}
          />
        </div>

        {loading ? (
          <p className={`text-center py-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
            Carregando pacientes...
          </p>
        ) : isAdmin ? (
          <>
            {pagination.totalPages > 1 && (
              <div className={`flex items-center justify-between mt-4 mb-4 gap-4 ${isDarkMode ? "text-slate-200" : "text-gray-800"}`}>
                <div className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}>
                  Página <strong>{pagination.page}</strong> de <strong>{pagination.totalPages}</strong> (Total: {pagination.total})
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className={`px-3 py-1.5 rounded-lg border text-sm ${pagination.page === 1 ? "cursor-not-allowed" : "cursor-pointer"} ${isDarkMode ? "border-slate-600 bg-slate-700 text-slate-100 disabled:opacity-50" : "border-gray-300 bg-white text-gray-800 disabled:opacity-50"}`}
                  >
                    Anterior
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className={`px-3 py-1.5 rounded-lg border text-sm ${pagination.page >= pagination.totalPages ? "cursor-not-allowed" : "cursor-pointer"} ${isDarkMode ? "border-slate-600 bg-slate-700 text-slate-100 disabled:opacity-50" : "border-gray-300 bg-white text-gray-800 disabled:opacity-50"}`}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}

            {filteredPatients.length > 0 ? (
              <ul className="space-y-3">
                {filteredPatients.map((patient) => (
                  <li
                    key={patient.id}
                    className={`p-4 border rounded-lg shadow-sm flex justify-between items-center transition ${isDarkMode ? "border-slate-600 bg-slate-700 hover:bg-slate-600" : "border-gray-200 hover:bg-gray-50"}`}
                  >
                    <div>
                      <p className="text-sm"><strong>Registro:</strong> {patient.id}</p>
                      <p className="text-sm"><strong>Nome:</strong> {patient.nome}</p>
                      <p className="text-sm"><strong>Email:</strong> {patient.email}</p>
                      <p className="text-sm"><strong>Telefone:</strong> {patient.telefone || "-"}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPatient(patient)}
                      className="bg-cyan-700 text-white px-3 py-2 rounded-lg hover:bg-cyan-600 cursor-pointer"
                    >
                      Selecionar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`text-center py-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                Nenhum paciente encontrado.
              </p>
            )}
          </>
        ) : (
          <p className={`text-center py-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
            <strong className="text-red-400">Acesso restrito</strong>, usuário não é administrador
          </p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedPatient && (
          <>
            <h2 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-cyan-400" : "text-cyan-700"}`}>
              Cadastrar consulta para {selectedPatient.nome}
            </h2>

            <div className={`mb-4 text-sm ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
              <p>
                <strong>Email:</strong> {selectedPatient.email}
              </p>
              <p>
                <strong>Telefone:</strong> {selectedPatient.telefone || "-"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reason" className={labelClass}>
                  Motivo da Consulta
                </label>
                <input
                  type="text"
                  name="reason"
                  id="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className={labelClass}>
                    Data
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="time" className={labelClass}>
                    Horário
                  </label>
                  <input
                    type="time"
                    name="time"
                    id="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="medico_responsavel_id" className={labelClass}>
                  ID do médico responsável
                </label>
                <input
                  type="number"
                  name="medico_responsavel_id"
                  id="medico_responsavel_id"
                  value={formData.medico_responsavel_id}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  Descrição do problema
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  rows={3}
                  onChange={handleInputChange}
                  required
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label htmlFor="medication" className={labelClass}>
                  Medicação receitada
                </label>
                <input
                  type="text"
                  name="medication"
                  id="medication"
                  value={formData.medication}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="dosagePrecautions" className={labelClass}>
                  Dosagem e Precauções
                </label>
                <input
                  type="text"
                  name="dosagePrecautions"
                  id="dosagePrecautions"
                  value={formData.dosagePrecautions}
                  onChange={handleInputChange}
                  required
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`px-4 py-2 rounded-lg transition ${isDarkMode
                      ? "bg-slate-600 text-slate-100 hover:bg-slate-500"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                >
                  Fechar
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 transition"
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </section>
  );
}

export default ConsultationForm;