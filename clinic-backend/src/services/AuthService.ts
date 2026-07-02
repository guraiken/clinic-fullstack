import type { Usuario } from "../prisma/generated/prisma/client";
import { createHash } from "../utils/createHash";
import bcrypt from "bcrypt";
import { signTokenAcesso, signTokenRefresh } from "../utils/jwt";
import { AuthRepository, authRepository } from "../repositories/AuthRepository";

export class AuthService {
    constructor(private readonly repository: AuthRepository) { // TO-DO TIPAR SERVICE
    }

    async cadastrar(dadosUsuario: Usuario) {
        const hash = await createHash(dadosUsuario.senha);

        const usuarioCriado = await this.repository.cadastrar({
            email: dadosUsuario.email,
            nome: dadosUsuario.nome || null,
            senha: hash,
            role: dadosUsuario.role || null
        })
        return usuarioCriado
    }

    async logar(dadosUsuario: Partial<Usuario>) {
        const existeUsuario = await this.repository.existeUsuario(dadosUsuario.email || '')
        const credenciaisValidas = await bcrypt.compare(dadosUsuario.senha || "", existeUsuario?.senha || "")
        if (!credenciaisValidas || !existeUsuario) throw new Error("Credenciais inválidas")
        console.log(existeUsuario, credenciaisValidas, dadosUsuario)
        if (existeUsuario && credenciaisValidas) {
            const tokenAcesso = signTokenAcesso({
                email: existeUsuario.email,
                nome: existeUsuario.nome,
                role: existeUsuario.role
            })
            const tokenRefresh = signTokenRefresh({
                email: existeUsuario.email,
                nome: existeUsuario.nome,
                role: existeUsuario.role
            })

            const accessExpires = new Date()
            const accessExpiresUpdate = accessExpires.setHours(accessExpires.getHours() + 1)
            // acesso create
            await this.repository.criarToken({
                token: tokenAcesso,
                expiresAt: new Date(accessExpiresUpdate),
                type: 'ACCESS',
                usuarioId: existeUsuario.id
            })

            //refresh create
            const refreshExpires = new Date()
            const refreshExpiresUpdated = refreshExpires.setMonth(refreshExpires.getMonth() + 1)

            await this.repository.criarToken({
                token: tokenRefresh,
                expiresAt: new Date(refreshExpiresUpdated),
                type: 'REFRESH',
                usuarioId: existeUsuario.id
            })

            return {
                tokenAcesso,
                tokenRefresh
            }
        }
    }
}

export const authService = new AuthService(authRepository)