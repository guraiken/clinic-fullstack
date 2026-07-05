const saltRound = 10;
import { hash } from "bcrypt"

export async function createHash(senha: string) {
    return await hash(senha, saltRound)
}