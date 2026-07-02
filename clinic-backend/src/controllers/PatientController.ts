import type { Request, Response } from "express";
import { patientService, type PatientService } from "../services/PatientService";
import { Prisma } from "../prisma/generated/prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

class PatientController {
    constructor(private readonly service: PatientService) { }

    async listarPacientes(req: Request, res: Response) {
        try {
            const pagina = req.query.pagina ? Number(req.query.pagina) : undefined
            const limite = req.query.limite ? Number(req.query.limite) : undefined

            if(pagina === undefined || limite === undefined) {
                const dadosPacientes = await this.service.listarPacientes()
                return res.status(200).json({
                    message: "Pacientes encontrados com sucesso!",
                    data: dadosPacientes
                })
            }else {   
                const dadosPacientes = await this.service.listarPacientes(pagina, limite)
                return res.status(200).json({
                    message: "Pacientes encontrados com sucesso!",
                    data: dadosPacientes
                })
            }
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

    async buscarPorId(req: Request, res: Response) {
        try {
            const idPaciente = Number(req.params.id)
            const dadosPaciente = await this.service.buscarPorId(idPaciente)
            return res.status(200).json({
                message: `Paciente id: ${idPaciente} encontrado!`,
                data: dadosPaciente
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

    async cadastrarPaciente(req: Request, res: Response) {
        try {
            const dadosPaciente = req.body
            const novoPaciente = await this.service.cadastrarPaciente(dadosPaciente)
            return res.status(201).json({
                message: "Novo paciente criado com sucesso!",
                data: novoPaciente
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

    async editarPaciente(req: Request, res: Response) {
        try {
            const novosDados = req.body
            const idPaciente = Number(req.params.id)

            const pacienteEditado = await this.service.editarPaciente({ ...novosDados, id: idPaciente })
            return res.status(200).json({
                message: "Paciente editado com sucesso",
                data: pacienteEditado
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

    async deletarPaciente(req: Request, res: Response) {
        const idPaciente = Number(req.params.id)
        const pacienteDeletado = await this.service.deletarPaciente(idPaciente)
        
        return res.status(200).json({
            message: "Paciente deletado com sucesso!",
            data: pacienteDeletado
        })
    }
}

export const patientController = new PatientController(patientService) 