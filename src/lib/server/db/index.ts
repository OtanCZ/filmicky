import { env } from '$env/dynamic/private';
import { PrismaClient } from '@prisma/client'

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export const prisma = new PrismaClient();