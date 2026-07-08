import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router";
import apiClient from "../../api/api";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const extractEntity = (payload) => payload?.data ?? payload ?? null;

const buildNameLookup = (items) =>
  items.reduce((map, item) => {
    if (item?.id != null) {
      map[item.id] = item.nome ?? "";
    }
    return map;
  }, {});

const fetchEntityById = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return extractEntity(response.data);
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error);
    return null;
  }
};

const enrichRecords = async (rawRecords) => {
  const records = normalizeList(rawRecords);

  const patientIds = [
    ...new Set(
      records
        .filter((record) => !record?.paciente?.nome && record?.paciente_id)
        .map((record) => record.paciente_id)
    ),
  ];

  const doctorIds = [
    ...new Set(
      records
        .filter((record) => !record?.usuario?.nome && record?.medico_responsavel_id)
        .map((record) => record.medico_responsavel_id)
    ),
  ];

  const [patients, doctors] = await Promise.all([
    Promise.all(patientIds.map((id) => fetchEntityById(`/pacientes/${id}`))),
    Promise.all(doctorIds.map((id) => fetchEntityById(`/usuarios/${id}`))),
  ]);

  const patientNames = buildNameLookup(patients.filter(Boolean));
  const doctorNames = buildNameLookup(doctors.filter(Boolean));

  return records.map((record) => ({
    ...record,
    pacienteNome:
      record?.paciente?.nome ?? patientNames[record.paciente_id] ?? null,
    medicoNome:
      record?.usuario?.nome ?? doctorNames[record.medico_responsavel_id] ?? null,
  }));
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("pt-BR");
};

const MedicalRecordList = () => {
  const { isDarkMode } = useOutletContext() || { isDarkMode: false };
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/prontuarios");
        const enrichedRecords = await enrichRecords(response.data);
        setRecords(enrichedRecords);
      } catch (error) {
        console.error("Erro ao obter prontuários:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredRecords = records.filter((record) => {
    const search = searchTerm.toLowerCase();
    const patientName = record?.pacienteNome ?? "";

    return (
      patientName.toLowerCase().includes(search) ||
      record.id.toString().includes(search) ||
      (record.descricao ?? "").toLowerCase().includes(search) ||
      (record.medicoNome ?? "").toLowerCase().includes(search)
    );
  });

  return (
    <div>
      <h1 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-slate-100" : "text-cyan-800"}`}>
        Listagem de Prontuários
      </h1>

      <section
        className={`p-6 rounded-2xl shadow border ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-transparent text-gray-900"}`}
      >
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <label htmlFor="search" className={`font-medium ${isDarkMode ? "text-slate-300" : "text-gray-700"}`}>
            Buscar Prontuário:
          </label>
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Digite o nome do paciente, descrição ou identificador"
            className={`w-full sm:w-1/2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600 ${isDarkMode ? "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400" : "bg-white border-gray-300 text-gray-900"}`}
          />
        </div>

        {loading ? (
          <p className={`text-center py-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Carregando prontuários...</p>
        ) : filteredRecords.length > 0 ? (
          <ul className="space-y-4">
            {filteredRecords.map((record) => (
              <li
                key={record.id}
                className={`p-4 rounded-lg shadow-sm border transition-shadow hover:shadow-md ${isDarkMode ? "bg-slate-700 border-slate-600" : "bg-gray-50 border-gray-200"}`}
              >
                <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                  <strong className={isDarkMode ? "text-slate-200" : "text-gray-700"}>Registro:</strong> {record.id}
                </p>
                <p className={isDarkMode ? "text-slate-200" : "text-gray-700"}>
                  <strong>Paciente:</strong> {record.pacienteNome ?? "Não informado"}
                </p>
                <p className={isDarkMode ? "text-slate-200" : "text-gray-700"}>
                  <strong>Descrição:</strong> {record.descricao || "-"}
                </p>
                <p className={isDarkMode ? "text-slate-200" : "text-gray-700"}>
                  <strong>Data:</strong> {formatDate(record.data)}
                </p>
                {record.medicoNome && (
                  <p className={isDarkMode ? "text-slate-200" : "text-gray-700"}>
                    <strong>Médico responsável:</strong> {record.medicoNome}
                  </p>
                )}
                <Link
                  to={`/paciente/${record.paciente_id}`}
                  className={`inline-block mt-2 font-semibold hover:underline ${isDarkMode ? "text-cyan-400" : "text-cyan-700"}`}
                >
                  Ver detalhes do paciente
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`text-center py-6 ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>Nenhum prontuário encontrado.</p>
        )}
      </section>
    </div>
  );
};

export default MedicalRecordList;
