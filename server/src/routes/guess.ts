import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'

export const guessRoutes = async (fastify: FastifyInstance) => {
    // rota que retorna a contagem de palpites
    fastify.get('/guesses/count', async () => {
        const count = await prisma.guess.count()
        return { count }
    })

    fastify.post('/pools/:poolId/games/:gameId/guesses', {
        onRequest: [authenticate]
    }, async (req, res) => {
        const createGuessParams = z.object({
            poolId: z.string(),
            gameId: z.string(),
        })

        const createGuessBody = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoints: z.number(),
        })

        const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(req.body)
        const { poolId, gameId } = createGuessParams.parse(req.params) // req.params puxa os parametros da url
    
        const participant  = await prisma.participant.findUnique({
            where: {
                userId_poolId: {
                    poolId,
                    userId: req.user.sub
                }
            }
        })

        if(!participant) {
            return res.status(400).send({
                message: "Você não tem permissão para criar um bolão."
            })
        }

        const guess = await prisma.guess.findUnique({
            where: {
                participantId_gameId: {
                    participantId: participant.id,
                    gameId
                }
            }
        })

        if(guess) {
            return res.status(400).send({
                message: "Você ja fez um palpite para esse bolão."
            })
        }

        const game = await prisma.game.findUnique({
            where: {
                id: gameId,
            }
        })

        if(!game) {
            return res.status(400).send({
                message: "Jogo não encontrado."
            })
        }
        
        if (game.date < new Date()) {
            return res.status(400).send({
                message: "Você não pode enviar palpites após a data do jogo.",
            })
        }

        await prisma.guess.create({
            data: {
                gameId,
                participantId: participant.id,
                firstTeamPoints,
                secondTeamPoints,
            }
        })

        return res.status(201).send()
    })
}


