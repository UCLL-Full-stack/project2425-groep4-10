import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { el } from 'date-fns/locale'
import { connect } from 'http2'

const prisma = new PrismaClient()

const main = async () => {
    await prisma.team.deleteMany()
    await prisma.coach.deleteMany()
    await prisma.player.deleteMany()
    await prisma.user.deleteMany()
    await prisma.match.deleteMany()

    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            password: await bcrypt.hash('admin123', 12),
            firstName: 'Admin',
            lastName: 'Istrator',
            email: 'admin.istrator@brax.be',
            role: 'admin'
        }
    },
    )

    const jeroen = await prisma.player.create({
        data: {
            user: {
                create: {
                    username: 'jeroen',
                    password: await bcrypt.hash('jeroen123', 12),
                    firstName: 'Jeroen',
                    lastName: 'R',
                    email: 'jeroen.r@ucll.be',
                    role: 'player'
                }
            },
            position: 'defender',
            age: 40
        }
    })

    const greetjej = await prisma.player.create({
        data: {
            user: {
                create: {
                    username: 'greetjej',
                    password: await bcrypt.hash('greetjej123', 12),
                    firstName: 'Greetje',
                    lastName: 'Jongen',
                    email: 'greetje.jongen@ucll.be',
                    role: 'player'
                }
            },
            position: 'midfielder',
            age: 40
        }
    })

    const johanp = await prisma.coach.create({
        data: {
            user: {
                create: {
                    username: 'johanp',
                    password: await bcrypt.hash('johanp123', 12),
                    firstName: 'Johan',
                    lastName: 'Pieck',
                    email: 'johan.pieck@ucll.be',
                    role: 'coach'
                }
            },
            rating: 5,
            experience: 10
        }
    })

    const rudis = await prisma.player.create({
        data: {
            user: {
                create: {
                    username: 'rudis',
                    password: await bcrypt.hash('rudis123', 12),
                    firstName: 'Rudi',
                    lastName: 'Swennen',
                    email: 'rudi.swennen@ucll.be',
                    role: 'player'
                }
            },
            position: 'goalkeeper',
            age: 40

        }
    })

    const pieterg = await prisma.player.create({
        data: {
            user: {
                create: {
                    username: 'pieterg',
                    password: await bcrypt.hash('pieterg123', 12),
                    firstName: 'Pieter',
                    lastName: 'Geens',
                    email: 'pieter.geens@ucll.be',
                    role: 'player'
                }
            },
            position: 'midfielder',
            age: 40
        }
    })

    const tiebev = await prisma.coach.create({
        data: {
            user: {
                create: {
                    username: 'tiebev',
                    password: await bcrypt.hash('tiebev123', 12),
                    firstName: 'Tiebe',
                    lastName: 'Van Nieuwenhove',
                    email: 'tiebe.vannieuwenhove@ucll.be',
                    role: 'coach'
                }
            },
            rating: 4,
            experience: 5
        }
    })

    const rafika = await prisma.coach.create({
        data: {
            user: {
                create: {
                    username: 'rafika',
                    password: await bcrypt.hash('rafika123', 12),
                    firstName: 'Rafik',
                    lastName: 'Anamse',
                    email: 'rafik.anamse@ucll.be',
                    role: 'coach'
                }
            },
            rating: 5,
            experience: 5
        }
    })

    const UCLL = await prisma.team.create({
        data: {
            teamName: "UCLL",
            location: "Leuven",
            coach: {
                connect: { id: johanp.id }
            },
            players: {
                connect: [{ id: jeroen.id }]
            }
        }
    })

    const KUL = await prisma.team.create({
        data: {
            teamName: "KUL",
            location: "Leuven",
            coach: {
                connect: { id: tiebev.id }
            },
            players: {
                connect: [{ id: rudis.id }]
            }
        }
    })

}

(async () => {
    try {
        await main()
        await prisma.$disconnect()
    } catch (error) {
        console.error(error)
        await prisma.$disconnect()
        process.exit(1)
    }
})()
