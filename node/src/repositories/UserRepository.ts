import { prisma } from "../prisma/prisma";
import type { PrismaClient, Usuario } from "../prisma/generated/prisma/client";

export class UserRepository {
    constructor(private readonly prisma: PrismaClient) {
        this.prisma = prisma
    }

    async buscarVarios() {
        return await this.prisma.usuario.findMany()
    }
    async buscarPorId(id: number) {
        return await this.prisma.usuario.findUnique({
            where: {
                id
            }
        })
    }

    async atualizar(dadosUsuario: Usuario) {
        return await this.prisma.usuario.update({
            data: {
                ...dadosUsuario
            },
            where: {
                id: dadosUsuario.id
            }
        })
    }

    async deletar(id: number) {
        return await this.prisma.usuario.delete({
            where: {
                id: id
            }
        })
    }
}

export const userRepository = new UserRepository(prisma)