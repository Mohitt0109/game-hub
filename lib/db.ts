import { PrismaClient } from "@prisma/client";


declare global {
  // allow global `prisma` to be used in development (without restarting the server)
  // https://pris.ly/d/help/next-js-best-practices
  var prisma: PrismaClient | undefined;
}

export const db = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}