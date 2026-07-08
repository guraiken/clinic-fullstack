import React, { useState, useEffect, useCallback } from "react";
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

  const [formData, setFormData] = useState({
    reason: "",
    date: "",
    time: "",
    description: "",
    medication: "",
    dosagePrecautions: "",
    medico_responsavel_id: "",
  });

  const fetchPatients = useCallback(async (isBlurSearch = false, currentSearch = "") => {
    try {
      if (!user || user.role !== "ADMIN") {
        setIsAdmin(false);
        setPatients([]);
        return;
      }

      setIsAdmin(true);

      const hasSearchTerm = currentSearch.trim().length > 0;
      const shouldFetchAll = isBlurSearch && hasSearchTerm;
      const url = shouldFetchAll ? "/pacientes" : "/pacientes?pagina=1&limite=4";

      const response = await apiClient.get(url);
      const patientsData = response?.data?.data?.pacientes ?? [];

      setPatients(patientsData);
    } catch (error) {
      console.error("Erro ao obter dados dos pacientes", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    fetchPatients(false, "");
  }, [fetchPatients]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      fetchPatients(false, "");
    }
  };

  const handleSearchBlur = (e) => {
    const value = e.target.value;
    if (!value.trim()) return;

    fetchPatients(true, value);
  };

  const filteredPatients = patients.filter((patient) =>
    [patient?.nome, patient?.email, patient?.telefone, patient?.id?.toString()]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        "Erro ao cadastrar consulta!";

      toast.error(errorMessage, {
        autoClose: 3000,
        hideProgressBar: false,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const labelClass = `block text-sm font-semibold mb-2 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`;
  const inputClass = `w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none ${
    isDarkMode
      ? "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
      : "bg-white border-gray-300 text-gray-900"
  }`;

  return (
    <section className={isDarkMode ? "text-slate-100" : "text-gray-800"}>
      <ToastContainer position="top-right" autoClose={3000} theme={isDarkMode ? "dark" : "light"} />
      <h1 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-slate-100" : "text-cyan-800"}`}>
        Cadastro de Consultas
      </h1>

      <div
        className={`p-6 rounded-2xl shadow border ${
          isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-transparent"
        }`}
      >
        <div className="mb-6">
          <label className={labelClass}>Buscar paciente para cadastrar a consulta</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
            placeholder="Digite o nome, email, telefone ou registro do paciente"
            className={inputClass}
          />
        </div>

        {loading ? (
          <p className={`text-center py-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
            Carregando pacientes...
          </p>
        ) : isAdmin ? (
          filteredPatients.length > 0 ? (
            <ul className="space-y-3">
              {filteredPatients.map((patient) => (
                <li
                  key={patient.id}
                  className={`p-4 border rounded-lg shadow-sm flex justify-between items-center transition ${
                    isDarkMode
                      ? "border-slate-600 bg-slate-700 hover:bg-slate-600"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <p className="text-sm">
                      <strong>Registro:</strong> {patient.id}
                    </p>
                    <p className="text-sm">
                      <strong>Nome:</strong> {patient.nome}
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> {patient.email}
                    </p>
                    <p className="text-sm">
                      <strong>Telefone:</strong> {patient.telefone || "-"}
                    </p>
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
          )
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
                  className={`px-4 py-2 rounded-lg transition ${
                    isDarkMode
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
