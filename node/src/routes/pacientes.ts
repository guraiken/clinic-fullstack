import { Router } from "express"
import { patientController } from "../controllers/PatientController"

export const patientRouter = Router()

// Endpoints pacientes
patientRouter.get('/pacientes', async (req, res) => {
  return patientController.listarPacientes(req, res)
})

patientRouter.get('/pacientes/:id', async (req, res) => {
  return patientController.buscarPorId(req, res)
})

patientRouter.post('/pacientes', async (req, res) => {
  return patientController.cadastrarPaciente(req, res)
})

patientRouter.put("/pacientes/:id", async (req, res) => {
  return patientController.editarPaciente(req, res)
})

patientRouter.delete('/pacientes/:id', async (req, res) => {
  return patientController.deletarPaciente(req,res)  
})
