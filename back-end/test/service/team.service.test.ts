import teamService from '../../service/team.service';
import teamDb from '../../domain/data-access/team.db';
import coachDb from '../../domain/data-access/coach.db';
import playerDb from '../../domain/data-access/player.db';
import { Team } from '../../domain/model/team';
import { Coach } from '../../domain/model/coach';
import { Player } from '../../domain/model/player';
import { User } from '../../domain/model/user';
import { Role, TeamInput } from '../../types';

jest.mock('../../domain/data-access/team.db');
jest.mock('../../domain/data-access/coach.db');
jest.mock('../../domain/data-access/player.db');

const validUserData = {
    id: 1,
    username: 'coachuser',
    firstName: 'Coach',
    lastName: 'User',
    email: 'coach@example.com',
    password: 'password123',
    role: 'coach' as Role
};

const validCoachData = {
    id: 1,
    user: new User(validUserData),
    rating: 5,
    experience: 10
};

const validPlayerUserData = {
    id: 2,
    username: 'playeruser',
    firstName: 'Player',
    lastName: 'User',
    email: 'player@example.com',
    password: 'password123',
    role: 'player' as Role
};

const validPlayerData = {
    id: 1,
    user: new User(validPlayerUserData),
    age: 20,
    position: 'Forward'
};

const validTeamData = {
    id: 1,
    teamName: 'Team A',
    location: 'Location A',
    coach: new Coach(validCoachData),
    players: [new Player(validPlayerData)]
};

describe('Team Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllTeams: should return all teams', async () => {
        (teamDb.getAllTeams as jest.Mock).mockResolvedValue([new Team(validTeamData)]);

        const teams = await teamService.getAllTeams();

        expect(teams).toHaveLength(1);
        expect(teams[0].teamName).toBe(validTeamData.teamName);
    });

    test('getTeamById: should return team by id', async () => {
        (teamDb.getTeamById as jest.Mock).mockResolvedValue(new Team(validTeamData));

        const team = await teamService.getTeamById({ id: validTeamData.id });

        expect(team?.id).toBe(validTeamData.id);
        expect(team?.teamName).toBe(validTeamData.teamName);
    });

    test('getTeamById: should return null if team does not exist', async () => {
        (teamDb.getTeamById as jest.Mock).mockResolvedValue(null);

        const team = await teamService.getTeamById({ id: validTeamData.id });

        expect(team).toBeNull();
    });

    test('createTeam: should create a new team', async () => {
        (coachDb.getCoachById as jest.Mock).mockResolvedValue(new Coach(validCoachData));
        (playerDb.getPlayerById as jest.Mock).mockResolvedValue(new Player(validPlayerData));
        (teamDb.createTeam as jest.Mock).mockResolvedValue(new Team(validTeamData));

        const teamInput: TeamInput = {
            teamName: 'Team A',
            location: 'Location A',
            coach: {
                id: validCoachData.id,
                user: validCoachData.user,
                rating: validCoachData.rating,
                experience: validCoachData.experience
            },
            players: [{
                id: validPlayerData.id,
                user: validPlayerData.user,
                position: validPlayerData.position,
                age: validPlayerData.age
            }]
        };

        const team = await teamService.createTeam(teamInput);

        expect(team.teamName).toBe(validTeamData.teamName);
        expect(team.location).toBe(validTeamData.location);
    });

    test('createTeam: should throw error if coach not found', async () => {
        (coachDb.getCoachById as jest.Mock).mockResolvedValue(null);

        const teamInput: TeamInput = {
            teamName: 'Team A',
            location: 'Location A',
            coach: {
                id: validCoachData.id,
                user: validCoachData.user,
                rating: validCoachData.rating,
                experience: validCoachData.experience
            },
            players: [{
                id: validPlayerData.id,
                user: validPlayerData.user,
                position: validPlayerData.position,
                age: validPlayerData.age
            }]
        };

        await expect(teamService.createTeam(teamInput))
            .rejects
            .toThrow('Coach not found');
    });

    test('createTeam: should throw error if one or more players not found', async () => {
        (coachDb.getCoachById as jest.Mock).mockResolvedValue(new Coach(validCoachData));
        (playerDb.getPlayerById as jest.Mock).mockResolvedValue(null);

        const teamInput: TeamInput = {
            teamName: 'Team A',
            location: 'Location A',
            coach: {
                id: validCoachData.id,
                user: validCoachData.user,
                rating: validCoachData.rating,
                experience: validCoachData.experience
            },
            players: [{
                id: validPlayerData.id,
                user: validPlayerData.user,
                position: validPlayerData.position,
                age: validPlayerData.age
            }]
        };

        await expect(teamService.createTeam(teamInput))
            .rejects
            .toThrow('One or more players not found');
    });

    test('joinTeam: should add player to team', async () => {
        (teamDb.getTeamById as jest.Mock).mockResolvedValue(new Team(validTeamData));
        (playerDb.getPlayerById as jest.Mock).mockResolvedValue(new Player(validPlayerData));
        (teamDb.joinTeam as jest.Mock).mockResolvedValue(new Team(validTeamData));

        const team = await teamService.joinTeam({ teamId: validTeamData.id, playerId: validPlayerData.id });

        expect(team.teamName).toBe(validTeamData.teamName);
    });

    test('joinTeam: should throw error if team not found', async () => {
        (teamDb.getTeamById as jest.Mock).mockResolvedValue(null);

        await expect(teamService.joinTeam({ teamId: validTeamData.id, playerId: validPlayerData.id }))
            .rejects
            .toThrow('Team not found');
    });

    test('joinTeam: should throw error if player not found', async () => {
        (teamDb.getTeamById as jest.Mock).mockResolvedValue(new Team(validTeamData));
        (playerDb.getPlayerById as jest.Mock).mockResolvedValue(null);

        await expect(teamService.joinTeam({ teamId: validTeamData.id, playerId: validPlayerData.id }))
            .rejects
            .toThrow('Player not found');
    });

    test('leaveTeam: should remove player from team', async () => {
        (teamDb.getTeamById as jest.Mock).mockResolvedValue(new Team(validTeamData));
        (playerDb.getPlayerById as jest.Mock).mockResolvedValue(new Player(validPlayerData));
        (teamDb.leaveTeam as jest.Mock).mockResolvedValue(new Team(validTeamData));

        const team = await teamService.leaveTeam({ teamId: validTeamData.id, playerId: validPlayerData.id });

        expect(team.teamName).toBe(validTeamData.teamName);
    });

    test('leaveTeam: should throw error if team not found', async () => {
        (teamDb.getTeamById as jest.Mock).mockResolvedValue(null);

        await expect(teamService.leaveTeam({ teamId: validTeamData.id, playerId: validPlayerData.id }))
            .rejects
            .toThrow('Team not found');
    });

    test('leaveTeam: should throw error if player not found', async () => {
        (teamDb.getTeamById as jest.Mock).mockResolvedValue(new Team(validTeamData));
        (playerDb.getPlayerById as jest.Mock).mockResolvedValue(null);

        await expect(teamService.leaveTeam({ teamId: validTeamData.id, playerId: validPlayerData.id }))
            .rejects
            .toThrow('Player not found');
    });

    test('updateTeam: should update team details', async () => {
        (teamDb.getTeamById as jest.Mock).mockResolvedValue(new Team(validTeamData));
        (teamDb.updateTeam as jest.Mock).mockResolvedValue(new Team({ ...validTeamData, teamName: 'Updated Team', location: 'Updated Location' }));

        const updatedTeam = await teamService.updateTeam({ id: validTeamData.id, teamName: 'Updated Team', location: 'Updated Location' });

        expect(updatedTeam.teamName).toBe('Updated Team');
        expect(updatedTeam.location).toBe('Updated Location');
    });

    test('updateTeam: should throw error if team not found', async () => {
        (teamDb.getTeamById as jest.Mock).mockResolvedValue(null);

        await expect(teamService.updateTeam({ id: validTeamData.id, teamName: 'Updated Team', location: 'Updated Location' }))
            .rejects
            .toThrow('Team not found');
    });
});