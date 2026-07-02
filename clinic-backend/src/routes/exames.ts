import { Router } from "express";
import { prisma } from "../prisma/prisma";
import { Role, type Exame } from "../prisma/generated/prisma/client";
import { examController } from "../controllers/ExamController";
import { roleMiddleware } from "../middleware/role";

export const examesRouter = Router()

examesRouter.use(roleMiddleware([Role.ADMIN]))
//Exames
examesRouter.get('/exames', async (_, res) => {
  return examController.buscarVarios(_, res)
})

examesRouter.get('/exames/:id', async (req, res) => {
  return examController.buscarPorId(req, res)
})

examesRouter.post("/exames", async (req, res) => {
  return examController.criar(req, res)
})

examesRouter.put("/exames/:id", async (req, res) => {
  return examController.atualizar(req, res)
})

examesRouter.delete('/exames/:id', async (req, res) => {
  return examController.deletar(req, res)
})