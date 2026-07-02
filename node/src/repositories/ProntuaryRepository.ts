import type { PrismaClient, Prontuario } from "../prisma/generated/prisma/client"
import { prisma } from "../prisma/prisma"

export class ProntuaryRepository {
    constructor(private readonly prisma: PrismaClient){
        this.prisma = prisma
    }

    async listarProntuarios() {
        return await this.prisma.prontuario.findMany()
    }

    async listarPorId(id: number) {
        return await this.prisma.prontuario.findUnique({
            where: {id}
        })
    }

    async criarProntuario(dadosProntuario: Partial<Prontuario>) {
        return await this.prisma.prontuario.create({
            data: {
                medico_responsavel_id: dadosProntuario.medico_responsavel_id || 0,
                paciente_id: dadosProntuario.paciente_id || 0,
                descricao: dadosProntuario.descricao || "",
                data: dadosProntuario.data || ""
            }
        })
    }

    async editarProntuario(dadosNovos: Partial<Prontuario>, id: number) {
        return await this.prisma.prontuario.update({
            where: {id},
            data: {
                paciente_id: dadosNovos.paciente_id || 0,
                medico_responsavel_id: dadosNovos.medico_responsavel_id || 0,
                descricao: dadosNovos.descricao || "",
                data: dadosNovos.data || "" 
            }
        })
    }

    async deletarProntuario(id:number) {
        return await this.prisma.prontuario.delete({
            where: {id}
        })
    }
}

export const prontuaryRepository = new ProntuaryRepository(prisma)