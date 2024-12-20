import teamDb from "../domain/data-access/team.db";
import { Team } from "../domain/model/team";
import coachDb from "../domain/data-access/coach.db";
import playerDb from "../domain/data-access/player.db";
import { Player } from "../domain/model/player";
import { TeamInput } from "../types/index";

const getAllTeams = async (): Promise<Team[]> => {
    return teamDb.getAllTeams();
}

const getTeamById = async ({ id }: { id: number }): Promise<Team | null> => {
    return teamDb.getTeamById({ id });
}

const createTeam = async ({ teamName, location, coach: CoachInput, players: PlayerInput = [] }: TeamInput): Promise<Team> => {
    try {
        console.log('Received team creation request:', { teamName, location, CoachInput, players: PlayerInput });

        if (!CoachInput || !CoachInput.id) {
            throw new Error('Coach ID is required');
        }

        const coach = await coachDb.getCoachById({ id: CoachInput.id });
        if (!coach) {
            throw new Error('Coach not found');
        }

        let validPlayers: Player[] = [];
        if (PlayerInput.length > 0) {
            const playerPromises = PlayerInput.map((player) => {
                if (!player.id) {
                    throw new Error('Player ID is required');
                }
                return playerDb.getPlayerById({ id: player.id });
            });

            const playersFetched = await Promise.all(playerPromises);
            validPlayers = playersFetched.filter((player) => player !== null) as Player[];

            if (validPlayers.length !== PlayerInput.length) {
                throw new Error('One or more players not found');
            }
        }

        const team = new Team({ teamName, location, coach, players: validPlayers });
        console.log('Creating team in DB:', team);
        return teamDb.createTeam(team);
    } catch (error) {
        console.error('Error creating team:', error);
        throw new Error(`Service error: ${error.message}`);
    }
};

const joinTeam = async ({ teamId, playerId }: { teamId: number, playerId: number }): Promise<Team> => {
    const team = await teamDb.getTeamById({ id: teamId });

    if (!team) {
        throw new Error('Team not found');
    }

    const player = await playerDb.getPlayerById({ id: playerId });

    if (!player) {
        throw new Error('Player not found');
    }

    return teamDb.joinTeam({ teamId, playerId });
}

const leaveTeam = async ({ teamId, playerId }: { teamId: number, playerId: number }): Promise<Team> => {
    const team = await teamDb.getTeamById({ id: teamId });

    if (!team) {
        throw new Error('Team not found');
    }

    const player = await playerDb.getPlayerById({ id: playerId });

    if (!player) {
        throw new Error('Player not found');
    }

    return teamDb.leaveTeam({ teamId, playerId });
}

const updateTeam = async ({ id, teamName, location }: { id: number, teamName: string, location: string }): Promise<Team> => {
    const team = await teamDb.getTeamById({ id });

    if (!team) {
        throw new Error('Team not found');
    }

    return teamDb.updateTeam({ id, teamName, location });
}



export default {
    getAllTeams,
    getTeamById,
    createTeam,
    joinTeam,
    leaveTeam,
    updateTeam
}
