import type { Paciente, PrismaClient } from "../prisma/generated/prisma/client";
import { prisma } from "../prisma/prisma";


export class PatientRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async listarPacientes(pagina?: number, limite?: number) {
        const existePaginacao = pagina! && limite!
        if (!existePaginacao) return { pacientes: await this.prisma.paciente.findMany() }

        const pacientes = await this.prisma.paciente.findMany({
            skip: (pagina - 1) * limite,
            take: limite
        })

        const total = Math.ceil(await this.prisma.paciente.count())
        const totalPaginas = Math.ceil(total / limite)
        return {
            pacientes,
            total,
            totalPaginas
        }
    }

    async cadastrarPaciente(dadosPaciente: Partial<Paciente>){
        return await this.prisma.paciente.create({
            data: {
                nome: dadosPaciente.nome || "",
                email: dadosPaciente.email || "",
                cpf: dadosPaciente.cpf || "",
                sexo: dadosPaciente.sexo || "",
                telefone: dadosPaciente.telefone || "",
                data_nascimento: dadosPaciente.data_nascimento || ""
            }
        })
    }

    async buscarPorId(id: number){
        return await this.prisma.paciente.findUnique({
            where: {id}
        })
    }

    async editarPaciente(dadosPaciente: Paciente){
        return await this.prisma.paciente.update({
            where: {id: dadosPaciente.id},
            data: {
                email: dadosPaciente.email,
                nome: dadosPaciente.nome,
                sexo: dadosPaciente.sexo,
                telefone: dadosPaciente.telefone,
                responsavel: dadosPaciente.responsavel,
                data_nascimento: dadosPaciente.data_nascimento 
            }
        })
    }

    async deletarPaciente(id: number){
        return await this.prisma.paciente.delete({
            where: {id}
        })
    }
}

export const patientRepository = new PatientRepository(prisma)