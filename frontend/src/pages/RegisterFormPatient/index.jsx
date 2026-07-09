import React, { useState } from "react";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router";

import { IMaskInput } from "react-imask";
import apiClient from "../../api/api";

function RegisterFormPatient() {
  const { isDarkMode } = useOutletContext();

  const labelClass = `block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`;
  const inputClass = `w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none ${isDarkMode ? "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400" : "bg-white border-gray-300 text-gray-900"}`;

  const [formData, setFormData] = useState({
    nome: "",
    sexo: "",
    data_nascimento: "",
    cpf: "",
    telefone: "",
    email: "",
    responsavel: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // handles

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); //operador spread e propriedade computada
  };

  //validação da data de nascimento

  const yesterday = new Date(); // retorna nesse exemplo => Mon Jun 15 2026 14:30:00 GMT-0300
  yesterday.setDate(yesterday.getDate() - 1); // retorna o dia atual menos um (ontem)

  //toISOString retorna uma string no formato 2026-06-14T17:30:00.000Z
  /*
    2026-06-14 → data
    T → separador
    17:30:00.000Z → horário UTC
    */

  /*
    .split("T")[0]
    separa a string no caractere T
    E pega a primeira parte do do índice devolvido, no caso "2026-06-14"

    <input
        type="date"
        max="2026-06-14"
    />

    */

  const maxBirthDate = yesterday.toISOString().split("T")[0];

  const validadeDate = () => {
    const selectedDate = new Date(formData.data_nascimento);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      toast.error("A data de nascimento deve ser anterior à data atual.", {
        autoClose: 2000,
        hideProgressBar: true,
      });
      return;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validadeDate()
    setIsSaving(true);

    try {
      const pacientes = await apiClient.post("/pacientes", formData); // ajuste a rota para "/pacientes" se for essa a usada no back-end

      console.log(pacientes.data)

      toast.success("Paciente cadastrado com sucesso!", {
        autoClose: 2000,
        hideProgressBar: true,
      });

      setFormData({
        nome: "",
        sexo: "",
        data_nascimento: "",
        cpf: "",
        telefone: "",
        email: "",
        responsavel: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao Salvar os dados!", {
        autoClose: 2000,
        hideProgressBar: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-slate-100" : "text-cyan-800"}`}>
        Cadastro de Paciente
      </h1>

      <div
        className={`shadow rounded-2xl p-6 border ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-transparent text-gray-900"}`}
      >
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      autoComplete="off"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 

        {/* Nome completo */}
        <fieldset>
          <label htmlFor="nome" className={labelClass}>
            Nome Completo
          </label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={formData.nome}
            onChange={handleInputChange}
            required
            className={inputClass}
          />
        </fieldset>

        {/* sexo */}

        <fieldset>
          <label htmlFor="sexo" className={labelClass}>
            Sexo
          </label>

          <select
            name="sexo"
            id="sexo"
            value={formData.sexo}
            onChange={handleInputChange}
            required
            className={inputClass}
          >
            <option value="">Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </fieldset>

        {/* Data de nascimento */}
        <fieldset>
          <label htmlFor="data_nascimento" className={labelClass}>
            Data de Nascimento
          </label>
          <input
            type="date"
            name="data_nascimento"
            id="data_nascimento"
            value={formData.data_nascimento}
            onChange={handleInputChange}
            onBlur={validadeDate}
            max={maxBirthDate}
            required
            className={inputClass}
          />
        </fieldset>

        {/* CPF */}
        <fieldset>
          <label htmlFor="cpf" className={labelClass}>
            CPF
          </label>
          <IMaskInput
            mask="000.000.000-00"
            name="cpf"
            minLength={14}
            id="cpf"
            value={formData.cpf}
            onAccept={(value) =>
              setFormData((prev) => ({ ...prev, cpf: value }))
            }
            className={inputClass}
          />
        </fieldset>

        {/* telefone */}
        <fieldset>
          <label htmlFor="telefone" className={labelClass}>
            Telefone
          </label>
          <IMaskInput
            mask="(00) 00000-0000"
            name="telefone"
            id="telefone"
            value={formData.telefone}
            onAccept={(value) =>
              setFormData((prev) => ({ ...prev, telefone: value }))
            }
            className={inputClass}
          />
        </fieldset>

        {/* Email */}
        <fieldset>
          <label htmlFor="email" className={labelClass}>
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={inputClass}
          />
        </fieldset>

        {/* Responsável (campo opcional no schema, ex: paciente menor de idade) */}
        <fieldset>
          <label htmlFor="responsavel" className={labelClass}>
            Responsável
          </label>
          <input
            type="text"
            name="responsavel"
            id="responsavel"
            value={formData.responsavel}
            onChange={handleInputChange}
            className={inputClass}
          />
        </fieldset>
      </div>

      {/* botão de envio */}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 transition-colors ${isDarkMode ? "bg-cyan-600 hover:bg-cyan-500" : "bg-cyan-700 hover:bg-cyan-600"}`}
        >
          {isSaving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
      </div>
    </div>
  );
}

export default RegisterFormPatient;
