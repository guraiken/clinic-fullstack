import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Modal } from "../Modal";
import apiClient from "../../api/api";

const PATIENTS_PER_PAGE = 5;

const ExamsForm = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [examData, setExamData] = useState({
        tipo_exame: "",
        data_exame: "",
        valor: "",
        descricao: "",
        resultado: "",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Buscar pacientes ao carregar o componente
    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get("/pacientes");
            const patientsData = response?.data?.data?.pacientes ?? []
            setPatients(patientsData);
            setFilteredPatients(patientsData);
        } catch (error) {
            console.error("Erro ao obter dados dos pacientes:", error);
            toast.error("Erro ao carregar a lista de pacientes!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filtered = patients.filter(
            (patient) =>
                patient.nome.toLowerCase().includes(searchTerm) ||
                patient.id.toString().includes(searchTerm)
        );
        setFilteredPatients(filtered);
        setCurrentPage(1); // volta para a primeira página a cada nova busca
    };

    const handleSelectModal = (patient) => {
        setSelectedPatient(patient);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedPatient(null);
        setIsModalOpen(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setExamData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setExamData({
            tipo_exame: "",
            data_exame: "",
            valor: "",
            descricao: "",
            resultado: "",
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedPatient) return;

        try {
            setIsSaving(true);
            const examToAdd = {
                ...examData,
                valor: parseFloat(examData.valor),
                pacienteId: selectedPatient.id,
            };

            await apiClient.post("/exames", examToAdd);
            toast.success("Exame cadastrado com sucesso!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
            });

            resetForm();
            handleCloseModal();
        } catch (error) {
            toast.error("Erro ao cadastrar o exame!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
            });
            console.error("Erro ao cadastrar exame:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Paginação ---
    const totalPages = Math.max(
        1,
        Math.ceil(filteredPatients.length / PATIENTS_PER_PAGE)
    );

    const paginatedPatients = filteredPatients.slice(
        (currentPage - 1) * PATIENTS_PER_PAGE,
        currentPage * PATIENTS_PER_PAGE
    );

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <section className="p-6 text-gray-800">
            {/* Campo de busca */}
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                    Buscar paciente para cadastrar exame
                </label>
                <input
                    type="text"
                    onChange={handleSearchChange}
                    placeholder="Digite o nome ou registro do paciente"
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                />
            </div>

            {/* Lista de pacientes */}
            {isLoading ? (
                <p className="text-gray-500 text-center py-6">Carregando pacientes...</p>
            ) : filteredPatients.length > 0 ? (
                <>
                    <ul className="space-y-3">
                        {paginatedPatients.map((patient) => (
                            <li
                                key={patient.id}
                                className="p-4 border rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50 transition"
                            >
                                <div>
                                    <p className="text-sm">
                                        <strong>Registro:</strong> {patient.id}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Nome:</strong> {patient.nome}
                                    </p>
                                    <p className="text-sm">
                                        <strong>CPF:</strong> {patient.cpf}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleSelectModal(patient)}
                                    className="bg-cyan-700 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-600 transition cursor-pointer"
                                >
                                    Selecionar
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <button
                                type="button"
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Anterior
                            </button>

                            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                                (page) => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => goToPage(page)}
                                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                                            page === currentPage
                                                ? "bg-cyan-700 text-white border-cyan-700"
                                                : "hover:bg-gray-100"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                )
                            )}

                            <button
                                type="button"
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg border text-sm cursor-pointer font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Próxima
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-500 text-center py-6">
                    Nenhum paciente encontrado
                </p>
            )}

            {/* Modal de cadastro de exame */}
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                {selectedPatient && (
                    <>
                        <h2 className="text-lg font-bold mb-4 text-cyan-700">
                            Cadastrar Exame para {selectedPatient.nome}
                        </h2>

                        <div className="mb-4 text-sm text-gray-700">
                            <p>
                                <strong>Email:</strong> {selectedPatient.email}
                            </p>
                            <p>
                                <strong>Telefone:</strong> {selectedPatient.telefone}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Tipo do Exame
                                </label>
                                <input
                                    type="text"
                                    name="tipo_exame"
                                    value={examData.tipo_exame}
                                    onChange={handleInputChange}
                                    required
                                    minLength={5}
                                    maxLength={30}
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Data do Exame
                                    </label>
                                    <input
                                        type="date"
                                        name="data_exame"
                                        value={examData.data_exame}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Valor (R$)
                                    </label>
                                    <input
                                        type="number"
                                        name="valor"
                                        value={examData.valor}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        required
                                        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Descrição do Exame
                                </label>
                                <textarea
                                    name="descricao"
                                    value={examData.descricao}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                    minLength={5}
                                    maxLength={500}
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Resultado do Exame
                                </label>
                                <textarea
                                    name="resultado"
                                    value={examData.resultado}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                    minLength={15}
                                    maxLength={1000}
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 transition cursor-pointer"
                                >
                                    {isSaving ? "Salvando..." : "Salvar"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </Modal>

            <ToastContainer />
        </section>
    );
};

export default ExamsForm;
