import { Player } from '../model/player';
import database from '../../util/database'

const getAllPlayers = async (): Promise<Player[]> => {
    try {
        const playersPrisma = await database.player.findMany({
            include: {
                user: true,
                team: true,
            },
        })
        return playersPrisma.map((playerPrisma) => Player.from(playerPrisma))
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const getPlayerById = async ({ id }: { id: number }): Promise<Player | null> => {
    try {
        const playerPrisma = await database.player.findUnique({
            where: { id },
            include: {
                user: true,
                team: true,
            },
        })
        return playerPrisma ? Player.from(playerPrisma) : null
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const createPlayer = async ({ user, position, age }: Player): Promise<Player> => {
    try {
        const playerPrisma = await database.player.create({
            data: {
                user: {
                    connect: { id: user.id },
                },
                position: position,
                age: age
            },
            include: {
                user: true,
                team: true,
            },
        })
        return Player.from(playerPrisma)
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const updatePlayer = async ({ id, user, position, age }: Player): Promise<Player> => {
    try {
        const playerPrisma = await database.player.update({
            where: { id },
            data: {
                user: {
                    connect: { id: user.id },
                },
                position: position,
                age: age
            },
            include: {
                user: true,
                team: true,
            },
        })
        return Player.from(playerPrisma)
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

export default {
    getAllPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer
}