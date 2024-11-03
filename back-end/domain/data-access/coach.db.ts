import { Coach } from "../model/coach";
import database from '../../util/database'

const getAllCoaches = async (): Promise<Coach[]> => {
    try {
        const coachesPrisma = await database.coach.findMany({
            include: {
                user: true
            }
        })
        return coachesPrisma.map((coachPrisma) => Coach.from(coachPrisma))
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const getCoachById = async ({ id }: { id: number }): Promise<Coach | null> => {
    try {
        const coachPrisma = await database.coach.findUnique({
            where: { id },
            include: {
                user: true
            }
        })
        return coachPrisma ? Coach.from(coachPrisma) : null
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const createCoach = async ({ user, rating, experience }: Coach): Promise<Coach> => {
    try {
        const coachPrisma = await database.coach.create({
            data: {
                user: {
                    connect: { id: user.id },
                },
                rating: rating,
                experience: experience
            },
            include: {
                user: true
            }
        })
        return Coach.from(coachPrisma)
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

export default {
    getAllCoaches,
    getCoachById,
    createCoach
}