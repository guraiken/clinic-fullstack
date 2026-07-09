import 'dotenv/config'

export const env = {
    chaveAcesso: process.env.CHAVE_ACESSO || "chaveSuperSecreta123456",
    chaveRefresh: process.env.CHAVE_REFRESH || "chaveSuperSecreta123456",
    usuarioDB: process.env.USUARIO || "postgres",
    senhaDB: process.env.SENHA || "Milenium_123",
    nomeBanco: process.env.NOME_BANCO || "clinic",
    hostDB: process.env.DB_HOST || "localhost",
    port: process.env.PORT || 5000
}