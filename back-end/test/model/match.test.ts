import { Match } from '../../domain/model/match';
import { Team } from '../../domain/model/team';
import { Coach } from '../../domain/model/coach';
import { Player } from '../../domain/model/player';
import { User } from '../../domain/model/user';
import { Role } from '../../types';

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
    rating: 4,
    experience: 3,
    age: 20,
    position: 'Forward',
    teamId: 1
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

test('given: valid match data, when: match is created, then: match is created with those values', () => {
    const match = new Match(validMatchData);

    expect(match.id).toBe(validMatchData.id);
    expect(match.teams.length).toBe(validMatchData.teams.length);
    expect(match.teams[0].equals(validMatchData.teams[0])).toBe(true);
    expect(match.dateTime).toEqual(validMatchData.dateTime);
    expect(match.location).toBe(validMatchData.location);
});

test('given: invalid teams, when: match is created, then: an error is thrown', () => {
    expect(() => {
        new Match({ ...validMatchData, teams: null as unknown as Team[] });
    }).toThrow("Match must have teams");
});

test('given: invalid dateTime, when: match is created, then: an error is thrown', () => {
    expect(() => {
        new Match({ ...validMatchData, dateTime: null as unknown as Date });
    }).toThrow("Match must have a date and time");
});

test('given: invalid location, when: match is created, then: an error is thrown', () => {
    expect(() => {
        new Match({ ...validMatchData, location: '' });
    }).toThrow("Match must have a location");
});

test('given: MatchPrisma object, when: Match is created from it, then: Match is created with those values', () => {
    const matchPrisma = {
        id: 1,
        teams: [
            {
                id: 1,
                teamName: 'Team A',
                location: 'Location A',
                coachId: 1,
                coach: {
                    id: 1,
                    userId: 1,
                    rating: 5,
                    experience: 10,
                    user: validUserData
                },
                players: [
                    {
                        id: 1,
                        userId: 2,
                        rating: 4,
                        experience: 3,
                        age: 20,
                        position: 'Forward',
                        teamId: 1,
                        user: validPlayerUserData
                    }
                ]
            }
        ],
        dateTime: new Date('2023-12-25T10:00:00Z'),
        location: 'Stadium A'
    };
    const match = Match.from(matchPrisma);
    expect(match.id).toBe(matchPrisma.id);
    expect(match.teams.length).toBe(matchPrisma.teams.length);
    expect(match.teams[0].equals(Team.from(matchPrisma.teams[0]))).toBe(true);
    expect(match.dateTime).toEqual(matchPrisma.dateTime);
    expect(match.location).toBe(matchPrisma.location);
});