import type { Request, Response } from "express";
import { prontuaryService, type ProntuaryService } from "../services/ProntuaryService";
import { ConsultService, consultService } from "../services/ConsultService";

class ConsultController {
    constructor(private readonly service: ConsultService) { }

    async listarConsultas(req: Request, res: Response) {
        try {
            const dadosConsultas = await this.service.listarConsultas()
            return res.status(200).json({
                message: "Consultas encontradas com sucesso!",
                data: dadosConsultas
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
            const idConsulta = Number(req.params.id)
            const dadosConsulta = await this.service.listarPorId(idConsulta)
            return res.status(200).json({
                message: `Prontuario id: ${idConsulta} encontrado!`,
                data: dadosConsulta
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

    async criarConsulta(req: Request, res: Response) {
        try {
            const dadosConsulta = req.body
            const novaConsulta = await this.service.criarConsulta(dadosConsulta)
            return res.status(201).json({
                message: "Nova consulta criada com sucesso!",
                data: novaConsulta
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

    async editarConsulta(req: Request, res: Response) {
        try {
            const novosDados = req.body
            const idPaciente = Number(req.params.id)

            const prontuarioEditado = await this.service.editarConsulta(novosDados, idPaciente)
            return res.status(200).json({
                message: "Consulta editada com sucesso",
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

    async deletarConsulta(req: Request, res: Response) {
        const idConsulta = Number(req.params.id)
        const consultaDeletada = await this.service.deletarConsulta(idConsulta)
        
        return res.status(200).json({
            message: "Consulta deletado com sucesso!",
            data: consultaDeletada
        })
    }
}

export const consultController = new ConsultController(consultService) 