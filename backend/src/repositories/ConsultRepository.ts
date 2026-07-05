
import type { PrismaClient, Consulta } from "../prisma/generated/prisma/client"
import { prisma } from "../prisma/prisma"

export class ConsultRepository {
    constructor(private readonly prisma: PrismaClient){
        this.prisma = prisma
    }

    async listarConsultas() {
        return await this.prisma.consulta.findMany()
    }

    async listarPorId(id: number) {
        return await this.prisma.consulta.findUnique({
            where: {id}
        })
    }

    async criarConsulta(dadosConsulta: Partial<Consulta>) {
        return await this.prisma.consulta.create({
            data: {
                data_consulta: dadosConsulta.data_consulta || "",
                medico_responsavel_id: dadosConsulta.medico_responsavel_id || 0,
                motivo: dadosConsulta.motivo || "",
                observacoes: dadosConsulta.observacoes || "",
                paciente_id: dadosConsulta.paciente_id || 0
            }
        })
    }

    async editarConsulta(dadosNovos: Partial<Consulta>, id: number) {
        return await this.prisma.consulta.update({
            where: {id},
            data: {
                data_consulta: dadosNovos.data_consulta || "",
                medico_responsavel_id: dadosNovos.medico_responsavel_id || 0,
                motivo: dadosNovos.motivo || "",
                observacoes: dadosNovos.observacoes || "",
                paciente_id: dadosNovos.paciente_id || 0
            }
        })
    }

    async deletarConsulta(id:number) {
        return await this.prisma.consulta.delete({
            where: {id}
        })
    }
}

export const consultRepository = new ConsultRepository(prisma)