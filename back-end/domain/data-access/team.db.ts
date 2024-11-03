import { Team } from '../../domain/model/team';

import database from '../../util/database'

const getAllTeams = async (): Promise<Team[]> => {
    try {
        const teamsPrisma = await database.team.findMany({
            include: {
                coach: { include: { user: true } },
                players: { include: { user: true } },
            },
        })
        return teamsPrisma.map((teamPrisma) => Team.from(teamPrisma))
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const getTeamById = async ({ id }: { id: number }): Promise<Team | null> => {
    try {
        const teamPrisma = await database.team.findUnique({
            where: { id },
            include: {
                coach: { include: { user: true } },
                players: { include: { user: true } },
            },
        })
        return teamPrisma ? Team.from(teamPrisma) : null
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const createTeam = async ({ coach, teamName, location }: Team): Promise<Team> => {
    try {
        const teamPrisma = await database.team.create({
            data: {
                coach: {
                    connect: { id: coach.id },
                },
                teamName: teamName,
                location: location,
            },
            include: {
                coach: { include: { user: true } },
                players: { include: { user: true } },
            },
        })
        return Team.from(teamPrisma)
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const updateTeam = async ({ id, coach, teamName, location }: Team): Promise<Team> => {
    try {
        const teamPrisma = await database.team.update({
            where: { id },
            data: {
                coach: {
                    connect: { id: coach.id },
                },
                teamName: teamName,
                location: location,
            },
            include: {
                coach: { include: { user: true } },
                players: { include: { user: true } },
            },
        })
        return Team.from(teamPrisma)
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const joinTeam = async ({ playerId, teamId }: { playerId: number, teamId: number }): Promise<Team> => {
    try {
        const teamPrisma = await database.team.update({
            where: { id: teamId },
            data: {
                players: {
                    connect: { id: playerId },
                },
            },
            include: {
                coach: { include: { user: true } },
                players: { include: { user: true } },
            },
        })
        return Team.from(teamPrisma)
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const leaveTeam = async ({ playerId, teamId }: { playerId: number, teamId: number }): Promise<Team> => {
    try {
        const teamPrisma = await database.team.update({
            where: { id: teamId },
            data: {
                players: {
                    disconnect: { id: playerId },
                },
            },
            include: {
                coach: { include: { user: true } },
                players: { include: { user: true } },
            },
        })
        return Team.from(teamPrisma)
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

const getTeamByName = async ({ teamName }: { teamName: string }): Promise<Team | null> => {
    try {
        const teamPrisma = await database.team.findFirst({
            where: { teamName },
            include: {
                coach: { include: { user: true } },
                players: { include: { user: true } },
            },
        })
        return teamPrisma ? Team.from(teamPrisma) : null
    } catch (error) {
        throw new Error('Database error. See server log for details.')
    }
}

export default {
    getAllTeams,
    getTeamById,
    createTeam,
    updateTeam,
    joinTeam,
    leaveTeam,
    getTeamByName,
}