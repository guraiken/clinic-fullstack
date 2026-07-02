import { Router } from "express"
import { consultController } from "../controllers/ConsultController"

export const consultRouter = Router()

// Endpoints consultas
consultRouter.get('/consultas', async (req, res) => {
  return consultController.listarConsultas(req, res)
})

consultRouter.get('/consultas/:id', async (req, res) => {
  return consultController.listarPorId(req, res)
})

consultRouter.post('/consultas', async (req, res) => {
  return consultController.criarConsulta(req, res)
})

consultRouter.put("/consultas/:id", async (req, res) => {
  return consultController.editarConsulta(req, res)
})

consultRouter.delete('/consultas/:id', async (req, res) => {
  return consultController.deletarConsulta(req,res)  
})
