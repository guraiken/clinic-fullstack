import 'dotenv/config'

export const env = {
    chaveAcesso: process.env.CHAVE_ACESSO || "chaveSuperSecreta123456",
    chaveRefresh: process.env.CHAVE_REFRESH || "chaveSuperSecreta123456",
    usuarioDB: process.env.USUARIO,
    senhaDB: process.env.SENHA,
    nomeBanco: process.env.NOME_BANCO,
    hostDB: process.env.DB_HOST || "localhost",
    port: process.env.PORT
}