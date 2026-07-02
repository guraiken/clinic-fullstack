import { Router } from "express"
import { prontuaryController } from "../controllers/ProntuaryController"
export const prontuaryRouter = Router()

// Endpoints pacientes
prontuaryRouter.get('/prontuarios', async (req, res) => {
  return prontuaryController.listarProntuarios(req, res)
})

prontuaryRouter.get('/prontuarios/:id', async (req, res) => {
  return prontuaryController.listarPorId(req, res)
})

prontuaryRouter.post('/prontuarios', async (req, res) => {
  return prontuaryController.criarProntuario(req, res)
})

prontuaryRouter.put("/prontuarios/:id", async (req, res) => {
  return prontuaryController.editarProntuario(req, res)
})

prontuaryRouter.delete('/prontuarios/:id', async (req, res) => {
  return prontuaryController.deletarProntuario(req,res)  
})
