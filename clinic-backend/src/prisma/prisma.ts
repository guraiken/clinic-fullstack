import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "../env";

const connectionString = process.env.DATABASE_URL || `postgresql://${env.usuarioDB}:${env.senhaDB}@${env.hostDB}:5432/${env.nomeBanco}?schema=public`;

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter, log: ['query'] });
