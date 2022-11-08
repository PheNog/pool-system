import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'
import ShortUniqueId from 'short-unique-id'
import { authenticate } from '../plugins/authenticate'


export const poolRoutes = async (fastify: FastifyInstance) => {
    // rota que retorna a contagem de bolões
    fastify.get('/pools/count', async () => {
        const count = await prisma.pool.count()
        return { count }
    })

    // rota que cria um novo bolão
    fastify.post('/pools', async (request, response) => {
        const createPoolBody = z.object({ //faz a validação do schema no body da requisição para evitar registros nulos por exemplo
            title: z.string(),
        })
        const { title } = createPoolBody.parse(request.body) // pega o title do body da requisição para evitar registros nulos por exemplo
        const generateCode = new ShortUniqueId({ length: 6 })
        const code = String(generateCode()).toUpperCase()

        try {
            await request.jwtVerify()
            await prisma.pool.create({
                data: {
                    title,
                    code: code,
                    ownerId: request.user.sub,
                    participants: {
                        create: {
                            userId: request.user.sub,
                        }
                    }
                }
            })
        } catch {
            await prisma.pool.create({
                data: {
                    title,
                    code: code,
                }
            })
        }
        return response.status(201).send({ code })
    })

    fastify.post('/pools/join', {
        onRequest: [authenticate]
    },
        async (req, res) => {
            const joinPoolBody = z.object({ //faz a validação do schema no body da requisição para evitar registros nulos por exemplo
                code: z.string(),
            })

            const { code } = joinPoolBody.parse(req.body)

            const pool = await prisma.pool.findUnique({
                where: {
                    code,
                },
                include: {
                    participants: {
                        where: {
                            userId: req.user.sub
                        }
                    }
                }
            })

            if (!pool) {
                return res.status(400).send({
                    message: 'Bolão não encontrado.'
                })
            }

            if (pool.participants.length > 0) {
                return res.status(400).send({
                    message: 'Você ja está nesse bolão!'
                })
            }

            if (!pool.ownerId) {
                await prisma.pool.update({
                    where: {
                        id: pool.id
                    },
                    data: {
                        ownerId: req.user.sub
                    }
                })
            }
            await prisma.participant.create({
                data: {
                    poolId: pool.id,
                    userId: req.user.sub,
                }
            })
            return res.status(200).send()
    })

    fastify.get('/pools', {
        onRequest: [authenticate]
    },async (req) => {
        const pools = await prisma.pool.findMany({
            where: {
                participants: {
                    some: {
                        userId: req.user.sub
                    }
                }
            },
            include: {
                owner: {
                    select: {
                        name: true,
                        id: true,
                    }
                },
                _count: {
                    select: {
                        participants: true,
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        }
                    }, 
                    take: 4,
                }
            }
        })
        return{ pools }
    })

    fastify.get('/pools/:id', {
        onRequest: [authenticate]
    },
    async(req)=> {
        const getPoolParams = z.object({ 
            id: z.string(),
        })

        const { id } = getPoolParams.parse(req.params)

        const pools = await prisma.pool.findUnique({
            where: {
                id,
            },
            include: {
                owner: {
                    select: {
                        name: true,
                        id: true,
                    }
                },
                _count: {
                    select: {
                        participants: true,
                    }
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                avatarUrl: true,
                            }
                        }
                    }, 
                    take: 4,
                }
            }
        })
        return { pools }
    })
}
