import type { Paciente } from "../prisma/generated/prisma/client";
import { patientRepository, PatientRepository } from "../repositories/PatientRepository";

export class PatientService{
    constructor(private readonly repository: PatientRepository){}

    async listarPacientes(pagina?: number, limite?: number){

        if(pagina === undefined || limite === undefined) return await this.repository.listarPacientes()

        return await this.repository.listarPacientes(pagina, limite)
    }

    async buscarPorId(id: number){
        const pacienteExiste = await this.repository.buscarPorId(id)
        if(!pacienteExiste) throw new Error(`Nenhum paciente encontrado com o id: ${id}`) 
        return pacienteExiste
    }

    async cadastrarPaciente(dadosPaciente: Paciente) {
        if(!dadosPaciente.nome || !dadosPaciente.email || !dadosPaciente.cpf || !dadosPaciente.data_nascimento || !dadosPaciente.sexo) {
            throw new Error("Por favor, preencha todos os campos")
        }
        const novoPaciente = await this.repository.cadastrarPaciente({
            data_nascimento: dadosPaciente.data_nascimento,
            email: dadosPaciente.email,
            nome: dadosPaciente.nome,
            cpf: dadosPaciente.cpf,
            sexo: dadosPaciente.sexo
        })
        return novoPaciente
    }

    async editarPaciente(dadosPaciente: Paciente){
        const pacienteExiste = this.repository.buscarPorId(Number(dadosPaciente.id))

        if(!dadosPaciente) throw new Error(`Por favor insira os dados do paciente`)
        if(!pacienteExiste) throw new Error(`Nenhum paciente encontrado com o id: ${dadosPaciente.id}`) 

        return await this.repository.editarPaciente(dadosPaciente)
    }

    async deletarPaciente(id: number) {
        if(!id) throw new Error(`Por favor, insira o id do usuário a ser deletado`)
        const pacienteExiste = await this.repository.buscarPorId(id)
        if(!pacienteExiste) throw new Error(`Não foi possível encontrar o paciente`)
        
        return await this.repository.deletarPaciente(id)
    }
}

export const patientService = new PatientService(patientRepository)