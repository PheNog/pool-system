import Fastify from 'fastify'
import cors from '@fastify/cors'
import { poolRoutes } from './routes/pool'
import { guessRoutes } from './routes/guess'
import { userRoutes } from './routes/user'
import { gameRoutes } from './routes/game'
import { authRoutes } from './routes/auth'
import jwt from '@fastify/jwt'



async function bootstrap() {

    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {
        origin: true,
    })


    // em produção isso precisa ser uma variavel ambiente
    await fastify.register(jwt, {
        secret: 'nlwcopa', // de preferencia um token mt doido pra n descobrirem nada parecido
    })

    // registra as routes importadas do arquivo correspondente no server.
    await fastify.register(authRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(guessRoutes)
    await fastify.register(poolRoutes)
    await fastify.register(userRoutes)


    //coloca server online
    await fastify.listen({ port: 4444, host: '0.0.0.0' })
}

bootstrap()