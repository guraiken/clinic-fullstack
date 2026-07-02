import type { Request, Response } from "express";
import { prontuaryService, type ProntuaryService } from "../services/ProntuaryService";

class ProntuaryController {
    constructor(private readonly service: ProntuaryService) { }

    async listarProntuarios(req: Request, res: Response) {
        try {
            const dadosProntuarios = await this.service.listarProntuarios()
            return res.status(200).json({
                message: "Prontuarios encontrados com sucesso!",
                data: dadosProntuarios
            })
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                return res.status(404).json({
                    error: error,
                    message: error?.message
                })
            }
        }
    }

    async listarPorId(req: Request, res: Response) {
        try {
            const idProntuario = Number(req.params.id)
            const dadosProntuario = await this.service.listarPorId(idProntuario)
            return res.status(200).json({
                message: `Prontuario id: ${idProntuario} encontrado!`,
                data: dadosProntuario
            })
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                return res.status(404).json({
                    error: error,
                    message: error?.message
                })
            }
        }
    }

    async criarProntuario(req: Request, res: Response) {
        try {
            const dadosProntuario = req.body
            const novoProntuario = await this.service.criarProntuario(dadosProntuario)
            return res.status(201).json({
                message: "Novo prontuário criado com sucesso!",
                data: novoProntuario
            })
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                return res.status(404).json({
                    error: error,
                    message: error?.message
                })
            }
        }
    }

    async editarProntuario(req: Request, res: Response) {
        try {
            const novosDados = req.body
            const idPaciente = Number(req.params.id)

            const prontuarioEditado = await this.service.editarProntuario(novosDados, idPaciente)
            return res.status(200).json({
                message: "Prontuário editado com sucesso",
                data: prontuarioEditado
            })
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                return res.status(404).json({
                    error: error,
                    message: error?.message
                })
            }
        }
    }

    async deletarProntuario(req: Request, res: Response) {
        const idProntuario = Number(req.params.id)
        const prontuarioDeletado = await this.service.deletarProntuario(idProntuario)
        
        return res.status(200).json({
            message: "Prontuário deletado com sucesso!",
            data: prontuarioDeletado
        })
    }
}

export const prontuaryController = new ProntuaryController(prontuaryService) 