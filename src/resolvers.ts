import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export const context = async ({ req }: { req: Request }) => {
  const token = req.headers.authorization?.split(" ")[1];
  let userId: number | null = null;
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
      userId = payload.userId;
    } catch {
      // token invalide
    }
  }
  return { prisma, userId };
};

export const resolvers = {
  Query: {
    users: (_: any, __: any, { prisma }: any) => prisma.user.findMany(),
  },
  Mutation: {
    signup: async (_: any, args: any, { prisma }: any) => {
      const user = await prisma.user.create({ data: args });
      return { token: jwt.sign({ userId: user.id }, JWT_SECRET), user };
    },
  },
};
