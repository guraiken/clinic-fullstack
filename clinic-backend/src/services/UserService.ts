import type { Usuario } from "../prisma/generated/prisma/client";
import { userRepository, type UserRepository } from "../repositories/UserRepository";

export class UserService{
    constructor(private readonly repository: UserRepository){
    }

    async buscarVarios(){
        return this.repository.buscarVarios()
    }

    async buscarPorId(id: number){
        return this.repository.buscarPorId(id)
    }

    async atualizar(dadosUsuario: Usuario){
        const existeUsuario = await this.repository.buscarPorId(dadosUsuario.id)
        if(existeUsuario){
            return await this.repository.atualizar(dadosUsuario)
        } else{
            throw new Error("Não foi possível encontrar o usuário")
        }
    }

    async deletar(id: number){
        const existeUsuario = await this.repository.buscarPorId(id)
        if(existeUsuario){
            return await this.repository.deletar(id)
        }
    }
}

export const userService = new UserService(userRepository)