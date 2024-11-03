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

const createTeam = async ({ teamName, location, coach: CoachInput, players: PlayerInput }: TeamInput): Promise<Team> => {
    if (!CoachInput.id) {
        throw new Error('Coach ID is required');
    }

    const coach = await coachDb.getCoachById({ id: CoachInput.id });

    if (!coach) {
        throw new Error('Coach not found');
    }

    const playerPromises = PlayerInput.map(player => {
        if (!player.id) {
            throw new Error('Player ID is required');
        }
        return playerDb.getPlayerById({ id: player.id });
    });

    const players = await Promise.all(playerPromises);

    const validPlayers = players.filter(player => player !== null) as Player[];

    if (validPlayers.length !== PlayerInput.length) {
        throw new Error('One or more players not found');
    }

    const team = new Team({ teamName, location, coach, players: validPlayers });
    return teamDb.createTeam(team);
}

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



export default {
    getAllTeams,
    getTeamById,
    createTeam,
    joinTeam,
    leaveTeam
}
