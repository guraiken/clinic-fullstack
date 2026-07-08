import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useOutletContext } from "react-router";

import { IMaskInput } from "react-imask";

function RegisterFormPatient() {
  const { isDarkMode } = useOutletContext();

  const labelClass = `block text-sm font-medium mb-1 ${isDarkMode ? "text-slate-300" : "text-gray-700"}`;
  const inputClass = `w-full border p-2 rounded-lg focus:ring-2 focus:ring-cyan-600 outline-none ${isDarkMode ? "bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400" : "bg-white border-gray-300 text-gray-900"}`;
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    birthdate: "",
    cpf: "",
    rg: "",
    maritalStatus: "",
    phone: "",
    email: "",
    birthplace: "",
    emergencyContact: "",
    allergies: "",
    specialCare: "",
    healthInsurance: "",
    insuranceNumber: "",
    insuranceValidity: "",
    address: {
      cep: "",
      city: "",
      state: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      reference: "",
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  // handles

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); //operador spread e propriedade computada
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    })); //operador spread e propriedade computada
  };

  // requisição para api viacep

  const fetchAddressData = async (cep) => {
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          cep: data.cep || "",
          city: data.localidade || "",
          state: data.uf || "",
          street: data.logradouro || "",
          complement: data.complemento || "",
          neighborhood: data.bairro || "",
        },
      }));
    } catch (error) {
      console.log("Erro ao buscar endereço", error);
    }
  };

  // tratamento do valor digitado no campo de cep

  const handleCepBlur = (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length === 8) fetchAddressData(cep);
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
    const selectedDate = new Date(formData.birthdate);

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
      await axios.post("http://localhost:3000/patients", formData);

      toast.success("Paciente cadastrado com sucesso!", {
        autoClose: 2000,
        hideProgressBar: true,
      });

      setFormData({
        fullName: "",
        gender: "",
        birthdate: "",
        cpf: "",
        rg: "",
        maritalStatus: "",
        phone: "",
        email: "",
        birthplace: "",
        emergencyContact: "",
        allergies: "",
        specialCare: "",
        healthInsurance: "",
        insuranceNumber: "",
        insuranceValidity: "",
        address: {
          cep: "",
          city: "",
          state: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          reference: "",
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao Salvar os dados!", {
        autoClose: 2000,
        hideProgressBar: true,
      });
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
          <label htmlFor="fullName" className={labelClass}>
            Nome Completo
          </label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            className={inputClass}
          />
        </fieldset>

        {/* gênero */}

        <fieldset>
          <label htmlFor="gender" className={labelClass}>
            Gênero
          </label>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
            className={inputClass}
          >
            <option value="">Selecione</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
          </select>
        </fieldset>

        {/* Data de nascimento */}
        <fieldset>
          <label htmlFor="birthdate" className={labelClass}>
            Data de Nascimento
          </label>
          <input
            type="date"
            name="birthdate"
            id="birthdate"
            value={formData.birthdate}
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

        {/* RG */}
        <fieldset>
          <label htmlFor="rg" className={labelClass}>
            RG:
          </label>
          <input
            type="text"
            name="rg"
            id="rg"
            value={formData.rg}
            onChange={handleInputChange}
            required
            className={inputClass}
          />
        </fieldset>

        {/* Estado Civil */}

        <fieldset>
          <label
            htmlFor="maritalStatus"
            className={labelClass}
          >
            Estado Civil
          </label>

          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleInputChange}
            required
            className={inputClass}
          >
            <option value="">Selecione</option>
            <option value="solteiro(a)">Solteiro(a)</option>
            <option value="casado(a)">Casado(a)</option>
            <option value="divorciado(a)">Divorciado(a)</option>
            <option value="viuvo(a)">Viúvo(a)</option>
          </select>
        </fieldset>

        {/* telefone */}
        <fieldset>
          <label htmlFor="phone" className={labelClass}>
            Telefone
          </label>
          <IMaskInput
            mask="(00) 00000-0000"
            name="phone"
            id="phone"
            value={formData.phone}
            onAccept={(value) =>
              setFormData((prev) => ({ ...prev, phone: value }))
            }
            className={inputClass}
          />
        </fieldset>

        {/* contato de emergência */}
        <fieldset>
          <label
            htmlFor="emergencyContact"
            className={labelClass}
          >
            Contato de Emergência
          </label>
          <IMaskInput
            mask="(00) 00000-0000"
            name="emergencyContact"
            id="emergencyContact"
            value={formData.emergencyContact}
            onAccept={(value) =>
              setFormData((prev) => ({ ...prev, emergencyContact: value }))
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

        {/* Naturalidade */}
        <fieldset>
          <label
            htmlFor="birthplace"
            className={labelClass}
          >
            Naturalidade:
          </label>
          <input
            type="text"
            name="birthplace"
            id="birthplace"
            value={formData.birthplace}
            onChange={handleInputChange}
            required
            className={inputClass}
          />
        </fieldset>

        {/* Alergias */}
        <fieldset>
          <label htmlFor="allergies" className={labelClass}>
            Alergias?
          </label>
          <input
            type="text"
            name="allergies"
            id="allergies"
            value={formData.allergies}
            onChange={handleInputChange}
            className={inputClass}
          />
        </fieldset>

        {/* Cuidados especiais */}
        <fieldset>
          <label
            htmlFor="specialCare"
            className={labelClass}
          >
            Cuidados Especiais?
          </label>
          <input
            type="text"
            name="specialCare"
            id="specialCare"
            value={formData.specialCare}
            onChange={handleInputChange}
            className={inputClass}
          />
        </fieldset>

        {/* Convênio */}
        <fieldset>
          <label
            htmlFor="healthInsurance"
            className={labelClass}
          >
            Convênio
          </label>
          <input
            type="text"
            name="healthInsurance"
            id="healthInsurance"
            value={formData.healthInsurance}
            onChange={handleInputChange}
            className={inputClass}
          />
        </fieldset>

        {/* Número do Convênio */}
        <fieldset>
          <label
            htmlFor="insuranceNumber"
            className={labelClass}
          >
            Número do Convênio
          </label>
          <input
            type="text"
            name="insuranceNumber"
            id="insuranceNumber"
            value={formData.insuranceNumber}
            onChange={handleInputChange}
            className={inputClass}
          />
        </fieldset>

        {/* Validade do Convênio */}
        <fieldset>
          <label
            htmlFor="insuranceValidity"
            className={labelClass}
          >
            Validade do Convênio
          </label>
          <input
            type="date"
            name="insuranceValidity"
            id="insuranceValidity"
            value={formData.insuranceValidity}
            onChange={handleInputChange}
            className={inputClass}
          />
        </fieldset>

        {/* CEP */}
        <fieldset>
          <label htmlFor="cep" className={labelClass}>
            CEP
          </label>
          <IMaskInput
            mask="00000-000"
            name="cep"
            id="cep"
            value={formData.address.cep}
            onBlur={handleCepBlur}
            onAccept={(value) =>
              handleAddressChange({ target: { name: "cep", value } })
            }
            className={inputClass}
          />
        </fieldset>

        {/* Rua */}
        <fieldset>
          <label htmlFor="street" className={labelClass}>
            Rua
          </label>
          <input
            type="text"
            name="street"
            id="street"
            value={formData.address.street}
            onChange={handleAddressChange}
            className={inputClass}
          />
        </fieldset>

        {/* Número */}
        <fieldset>
          <label htmlFor="number" className={labelClass}>
            Número
          </label>
          <input
            type="text"
            name="number"
            id="number"
            value={formData.address.number}
            onChange={handleAddressChange}
            className={inputClass}
          />
        </fieldset>

        {/* Complemento */}
        <fieldset>
          <label
            htmlFor="complement"
            className={labelClass}
          >
            Complemento
          </label>
          <input
            type="text"
            name="complement"
            id="complement"
            value={formData.address.complement}
            onChange={handleAddressChange}
            className={inputClass}
          />
        </fieldset>

        {/* Referência */}
        <fieldset>
          <label htmlFor="reference" className={labelClass}>
            Referência
          </label>
          <input
            type="text"
            name="reference"
            id="reference"
            value={formData.address.reference}
            onChange={handleAddressChange}
            className={inputClass}
          />
        </fieldset>

        {/* Bairro */}
        <fieldset>
          <label
            htmlFor="neighborhood"
            className={labelClass}
          >
            Bairro
          </label>
          <input
            type="text"
            name="neighborhood"
            id="neighborhood"
            value={formData.address.neighborhood}
            onChange={handleAddressChange}
            className={inputClass}
          />
        </fieldset>

        {/* Cidade */}
        <fieldset>
          <label htmlFor="city" className={labelClass}>
            Cidade
          </label>
          <input
            type="text"
            name="city"
            id="city"
            value={formData.address.city}
            onChange={handleAddressChange}
            className={inputClass}
          />
        </fieldset>

        {/* Estado */}
        <fieldset>
          <label htmlFor="state" className={labelClass}>
            Estado
          </label>
          <input
            type="text"
            name="state"
            id="state"
            value={formData.address.state}
            onChange={handleAddressChange}
            disabled="true"
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
