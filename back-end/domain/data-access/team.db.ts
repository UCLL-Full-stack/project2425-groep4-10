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

const createTeam = async ({ teamName, location, coach, players }: Team): Promise<Team> => {
    try {
        console.log('Creating team:', { teamName, location, coach, players });

        const teamPrisma = await database.team.create({
            data: {
                teamName: teamName,
                location: location,
                coach: { connect: { id: coach.id } },
                players: players && players.length > 0 ? { connect: players.map(player => ({ id: player.id })) } : undefined,
            },
            include: {
                coach: { include: { user: true } },
                players: { include: { user: true } },
            },
        });

        console.log('Team created successfully:', teamPrisma);
        return Team.from(teamPrisma);
    } catch (error) {
        console.error('Error creating team:', error);
        throw new Error(`Database error. See server log for details. Error: ${error.message}`);
    }
};


const updateTeam = async ({ id, teamName, location }: { id: number, teamName: string, location: string }): Promise<Team> => {
    try {
        const teamPrisma = await database.team.update({
            where: { id },
            data: {
                teamName: teamName,
                location: location,
            },
            include: {
                coach: { include: { user: true } },
                players: { include: { user: true } },
            },
        });
        return Team.from(teamPrisma);
    } catch (error) {
        console.error('Error updating team:', error);
        throw new Error(`Database error. See server log for details. Error: ${error.message}`);
    }
};

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