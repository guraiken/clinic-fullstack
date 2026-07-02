import type { NextFunction, Request, Response } from "express";
import type { Role } from "../prisma/generated/prisma/enums";
import { getToken, verificarTokenAcesso } from "../utils/jwt";
import type { Token, Usuario } from "../prisma/generated/prisma/client";



export function roleMiddleware(roles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "missing token"
            })
        }
        try {
            const token = header.slice("Bearer ".length)
            const payload = verificarTokenAcesso(token)
            if (!payload) return res.status(401).json({
                error: "invalid token"
            })
            const tokenData = getToken(token)

            if(!tokenData?.role || !roles.includes(tokenData?.role || "ADMIN")){
                return res.status(403).json({
                    message: "Acesso negado"
                })
            }
            next();
        } catch {
            return res.status(401).json({
                error: "invalid or expired token"
            })
        }
    }
}