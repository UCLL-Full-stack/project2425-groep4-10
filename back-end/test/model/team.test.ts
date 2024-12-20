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

test('given: valid team data, when: team is created, then: team is created with those values', () => {
    const team = new Team(validTeamData);

    expect(team.id).toBe(validTeamData.id);
    expect(team.teamName).toBe(validTeamData.teamName);
    expect(team.location).toBe(validTeamData.location);
    expect(team.coach.equals(validTeamData.coach)).toBe(true);
    expect(team.players.length).toBe(validTeamData.players.length);
    expect(team.players[0].equals(validTeamData.players[0])).toBe(true);
});

test('given: invalid teamName, when: team is created, then: an error is thrown', () => {
    expect(() => {
        new Team({ ...validTeamData, teamName: '' });
    }).toThrow("Team must have a name");
});

test('given: invalid location, when: team is created, then: an error is thrown', () => {
    expect(() => {
        new Team({ ...validTeamData, location: '' });
    }).toThrow("Team must have a location");
});

test('given: two equal teams, when: compared, then: they are equal', () => {
    const team1 = new Team(validTeamData);
    const team2 = new Team(validTeamData);
    expect(team1.equals(team2)).toBe(true);
});

test('given: two different teams, when: compared, then: they are not equal', () => {
    const team1 = new Team(validTeamData);
    const team2 = new Team({ ...validTeamData, teamName: 'Team B' });
    expect(team1.equals(team2)).toBe(false);
});

test('given: TeamPrisma object, when: Team is created from it, then: Team is created with those values', () => {
    const teamPrisma = {
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
    };
    const team = Team.from(teamPrisma);
    expect(team.id).toBe(teamPrisma.id);
    expect(team.teamName).toBe(teamPrisma.teamName);
    expect(team.location).toBe(teamPrisma.location);
    expect(team.coach.equals(Coach.from(teamPrisma.coach))).toBe(true);
    expect(team.players.length).toBe(teamPrisma.players.length);
    expect(team.players[0].equals(Player.from(teamPrisma.players[0]))).toBe(true);
});