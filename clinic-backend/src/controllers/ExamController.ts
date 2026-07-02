import { examService, type ExamService } from "../services/ExamService";
import type { Response, Request } from "express";

class ExamController {
    constructor(private readonly service: ExamService) { }

    async buscarVarios(req: Request, res: Response) {
        try {
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined

            const dadosExames = await this.service.buscarVarios(pagina, limite)
            return res.status(200).json({
                message: "Exames encontrados com sucesso!",
                data: dadosExames
            })
        } catch (error) {
            return res.status(404).json({
                message: "Exames não puderam ser encontrados"
            })
        }
    }

    async buscarPorId(req: Request, res: Response) {
        try {
            const exameId = Number(req.params.id)
            const dadosExame = await this.service.buscarPorId(exameId)
            return res.status(200).json({
                message: "Usuário encontrado com sucesso",
                data: dadosExame
            })
        } catch (error) {
            return res.status(404).json({ message: error })
        }
    }

    async criar(req: Request, res: Response) {
        try {
            const dadosExame = req.body
            const exameCriado = await this.service.criar(dadosExame)
            return res.status(201).json({
                message: "Exame criado com sucesso!",
                data: exameCriado
            })
        } catch (error) {
            return res.status(404).json(error)
        }
    }

    async atualizar(req: Request, res: Response) {
        try {
            const novosDados = req.body
            const atualizarDados = await this.service.atualizar(novosDados)
            return res.status(201).json({
                message: "Usuario atualizado!",
                data: atualizarDados
            })
        } catch (error) {
            return res.status(404).json(error)
        }
    }

    async deletar(req: Request, res: Response) {
        try {
            const exameId = Number(req.params.id)
            const deletarExame = await this.service.deletar(exameId)
            return res.status(200).json({
                message: "Exame deletado com sucesso",
                data: deletarExame
            })
        } catch (error) {
            return res.status(404).json(error)
        }
    }
}

export const examController = new ExamController(examService)