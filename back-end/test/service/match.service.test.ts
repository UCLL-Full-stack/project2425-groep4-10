import matchService from '../../service/match.service';
import matchDb from '../../domain/data-access/match.db';
import { Match } from '../../domain/model/match';
import { Team } from '../../domain/model/team';
import { Coach } from '../../domain/model/coach';
import { Player } from '../../domain/model/player';
import { User } from '../../domain/model/user';
import { Role } from '../../types';

jest.mock('../../domain/data-access/match.db');

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

const validMatchData = {
    id: 1,
    teams: [new Team(validTeamData)],
    dateTime: new Date('2023-12-25T10:00:00Z'),
    location: 'Stadium A'
};

describe('Match Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllMatches: should return all matches', async () => {
        (matchDb.getAllMatches as jest.Mock).mockResolvedValue([new Match(validMatchData)]);

        const matches = await matchService.getAllMatches();

        expect(matches).toHaveLength(1);
        expect(matches[0].location).toBe(validMatchData.location);
    });

    test('getMatchById: should return match by id', async () => {
        (matchDb.getMatchById as jest.Mock).mockResolvedValue(new Match(validMatchData));

        const match = await matchService.getMatchById({ id: validMatchData.id });

        expect(match?.id).toBe(validMatchData.id);
        expect(match?.location).toBe(validMatchData.location);
    });

    test('getMatchById: should return null if match does not exist', async () => {
        (matchDb.getMatchById as jest.Mock).mockResolvedValue(null);

        const match = await matchService.getMatchById({ id: validMatchData.id });

        expect(match).toBeNull();
    });

    test('createMatch: should create a new match', async () => {
        (matchDb.createMatch as jest.Mock).mockResolvedValue(new Match(validMatchData));

        const match = await matchService.createMatch({
            teamIds: [validTeamData.id],
            dateTime: validMatchData.dateTime,
            location: validMatchData.location
        });

        expect(match.location).toBe(validMatchData.location);
        expect(match.dateTime).toEqual(validMatchData.dateTime);
    });
});