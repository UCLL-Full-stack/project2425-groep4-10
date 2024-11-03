import { Parent } from "../model/parent";
import database from '../../util/database'

const getAllParents = async (): Promise<Parent[]> => {
    try {
        const parentsPrisma = await database.parent.findMany({
            include: {
                user: true
            }
        })
        return parentsPrisma.map((parentPrisma) => Parent.from(parentPrisma))
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const getParentById = async ({ id }: { id: number }): Promise<Parent | null> => {
    try {
        const parentPrisma = await database.parent.findUnique({
            where: { id },
            include: {
                user: true
            }
        })
        return parentPrisma ? Parent.from(parentPrisma) : null
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const createParent = async ({ user, sex }: Parent): Promise<Parent> => {
    try {
        const parentPrisma = await database.parent.create({
            data: {
                user: {
                    connect: { id: user.id },
                },
                sex: sex
            },
            include: {
                user: true
            }
        })
        return Parent.from(parentPrisma)
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

export default {
    getAllParents,
    getParentById,
    createParent,
}