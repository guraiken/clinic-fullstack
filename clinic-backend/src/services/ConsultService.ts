import type { Consulta, Prontuario } from "../prisma/generated/prisma/client";
import { ConsultRepository, consultRepository } from "../repositories/ConsultRepository";
import { prontuaryRepository, type ProntuaryRepository } from "../repositories/ProntuaryRepository";

export class ConsultService{
    constructor(private readonly repository: ConsultRepository){}

    async listarConsultas() {
        const dadosConsultas = await this.repository.listarConsultas()
        
        if(!dadosConsultas) throw new Error("Não foi encontrado os dados das consultas")

        return dadosConsultas
    }

    async listarPorId(id: number) {
        if(!id) throw new Error("Por favor, preencha o parametro de id")
        
        const consultaExiste = await this.repository.listarPorId(id)
        if(!consultaExiste) throw new Error("Não foi encontrado nenhuma consulta com este id")

        return consultaExiste
    }

    async criarConsulta(dadosConsulta: Consulta) {
        if(!dadosConsulta.data_consulta || !dadosConsulta.motivo || !dadosConsulta.medico_responsavel_id || !dadosConsulta.paciente_id || !dadosConsulta.observacoes){
            throw new Error("Por favor, preencha todos os campos obrigatórios: (data, observações, motivo, médico res, paciente)")
        }

        const novaConsulta = await this.repository.criarConsulta(dadosConsulta)
        return novaConsulta
    }

    async editarConsulta(dadosConsulta: Consulta, id: number){
        if(!dadosConsulta || !id) throw new Error("Por favor, preencha todos os campos")

        const consultaExiste = await this.repository.listarPorId(id)
        if(!consultaExiste) throw new Error("Não foi encontrado nenhuma consulta com este id")
        if(!dadosConsulta.data_consulta || !dadosConsulta.motivo || !dadosConsulta.medico_responsavel_id || !dadosConsulta.paciente_id || !dadosConsulta.observacoes){
            throw new Error("Por favor, preencha todos os campos obrigatórios: (data, observações, motivo, médico res, paciente)")
        }

        const consultaEditada = await this.repository.editarConsulta(dadosConsulta, id)
        return consultaEditada
    }

    async deletarConsulta(id: number) {
        if(!id) throw new Error("Por favor, preencha o id")

        const consultaExiste = await this.repository.listarPorId(id)
        if(!consultaExiste) throw new Error("Não foi encontrado nenhum usuário com este id")

        const consultaDeletada = await this.repository.deletarConsulta(id)
        return consultaDeletada
    }
}

export const consultService = new ConsultService(consultRepository)