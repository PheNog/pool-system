import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export const userRoutes = async (fastify: FastifyInstance) => {

    // rota que retorna a contagem de  usuarios
    fastify.get('/users/count', async () => {
        const count = await prisma.user.count()
        return { count }
    })
}
