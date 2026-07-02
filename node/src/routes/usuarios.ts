import { Router } from "express";
import { prisma } from "../prisma/prisma";
import type { Usuario } from "../prisma/generated/prisma/client";
import { userController } from "../controllers/UserController";

export const userRouter = Router()

// Endpoints usuario
userRouter.get('/usuarios', async (req, res) => {
  return userController.buscarVarios(req, res)
})

userRouter.get('/usuarios/:id', async (req, res) => {
  return userController.buscarId(req, res)
})

userRouter.put("/usuarios/:id", async (req, res) => {
  return userController.atualizar(req, res)
})

userRouter.delete('/usuarios/:id', async (req, res) => {
  return userController.deletar(req,res)  
})
