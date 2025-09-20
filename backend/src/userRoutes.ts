import { FastifyInstance } from 'fastify'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    const users = await prisma.user.findMany()
    return users
  })

  fastify.post('/', async (request, reply) => {
    const { email, username } = request.body as { email: string; username: string }
    const user = await prisma.user.create({
      data: { email, username },
    })
    return user
  })
}
