import type { Prontuario } from "../prisma/generated/prisma/client";
import { prontuaryRepository, type ProntuaryRepository } from "../repositories/ProntuaryRepository";

export class ProntuaryService{
    constructor(private readonly repository: ProntuaryRepository){}

    async listarProntuarios() {
        const dadosProntuarios = await this.repository.listarProntuarios()
        
        if(!dadosProntuarios) throw new Error("Não foi encontrado os dados dos prontuários")

        return dadosProntuarios
    }

    async listarPorId(id: number) {
        if(!id) throw new Error("Por favor, preencha o parametro de id")
        
        const prontuarioExiste = await this.repository.listarPorId(id)
        if(!prontuarioExiste) throw new Error("Não foi encontrado nenhum prontuário com este id")

        return prontuarioExiste
    }

    async criarProntuario(dadosProntuario: Prontuario) {
        if(!dadosProntuario.data || !dadosProntuario.descricao || !dadosProntuario.medico_responsavel_id || !dadosProntuario.paciente_id){
            throw new Error("Por favor, preencha todos os campos obrigatórios: (data, descrição, médico res, paciente")
        }

        const novoProntuario = await this.repository.criarProntuario(dadosProntuario)
        return novoProntuario
    }

    async editarProntuario(dadosProntuario: Prontuario,id: number){
        if(!dadosProntuario || id) throw new Error("Por favor, preencha todos os campos")

        const prontuarioExiste = await this.repository.listarPorId(id)
        if(!prontuarioExiste) throw new Error("Não foi encontrado nenhum prontuário com este id")
        if(!dadosProntuario.data || !dadosProntuario.descricao || !dadosProntuario.medico_responsavel_id || !dadosProntuario.paciente_id){
            throw new Error("Por favor, preencha todos os campos obrigatórios: (data, descrição, médico res, paciente")
        }

        const usuarioEditado = await this.repository.editarProntuario(dadosProntuario, id)
        return usuarioEditado
    }

    async deletarProntuario(id: number) {
        if(!id) throw new Error("Por favor, preencha o id")

        const prontuarioExiste = await this.repository.listarPorId(id)
        if(!prontuarioExiste) throw new Error("Não foi encontrado nenhum usuário com este id")

        const prontuarioDeletado = await this.repository.deletarProntuario(id)
        return prontuarioDeletado
    }
}

export const prontuaryService = new ProntuaryService(prontuaryRepository)