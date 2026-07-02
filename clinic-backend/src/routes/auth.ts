import { Router } from "express";
import { createHash } from "../utils/createHash";
import { prisma } from "../prisma/prisma";
import { signTokenAcesso, signTokenRefresh } from "../utils/jwt";
import bcrypt from "bcrypt";
import type { Usuario } from "../prisma/generated/prisma/client";
import { authController } from "../controllers/AuthController";

export const authRouter = Router();

authRouter.post("/cadastro", async (req, res) => {
    return authController.cadastrar(req, res)
})

authRouter.post("/login", async (req, res) => {
    return authController.logar(req, res)
})