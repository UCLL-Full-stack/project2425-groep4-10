import { Player } from '../../domain/model/player';
import { User } from '../../domain/model/user';
import { Role } from '../../types';

const validUserData = {
    id: 1,
    username: 'playeruser',
    firstName: 'Player',
    lastName: 'User',
    email: 'player@example.com',
    password: 'password123',
    role: 'player' as Role
};

const validPlayerData = {
    id: 1,
    user: new User(validUserData),
    age: 20,
    position: 'Forward'
};

test('given: valid player data, when: player is created, then: player is created with those values', () => {
    const player = new Player(validPlayerData);

    expect(player.id).toBe(validPlayerData.id);
    expect(player.user.equals(validPlayerData.user)).toBe(true);
    expect(player.age).toBe(validPlayerData.age);
    expect(player.position).toBe(validPlayerData.position);
});

test('given: invalid user, when: player is created, then: an error is thrown', () => {
    expect(() => {
        new Player({ ...validPlayerData, user: null as unknown as User });
    }).toThrow("Player must have a user");
});

test('given: invalid age, when: player is created, then: an error is thrown', () => {
    expect(() => {
        new Player({ ...validPlayerData, age: null as unknown as number });
    }).toThrow("Player must have an age");
});

test('given: invalid position, when: player is created, then: an error is thrown', () => {
    expect(() => {
        new Player({ ...validPlayerData, position: '' });
    }).toThrow("Player must have a position");
});

test('given: two equal players, when: compared, then: they are equal', () => {
    const player1 = new Player(validPlayerData);
    const player2 = new Player(validPlayerData);
    expect(player1.equals(player2)).toBe(true);
});

test('given: two different players, when: compared, then: they are not equal', () => {
    const player1 = new Player(validPlayerData);
    const player2 = new Player({ ...validPlayerData, age: 21 });
    expect(player1.equals(player2)).toBe(false);
});

test('given: PlayerPrisma object, when: Player is created from it, then: Player is created with those values', () => {
    const playerPrisma = {
        id: 1,
        userId: 1,
        user: validUserData,
        age: 20,
        position: 'Forward',
        teamId: 1
    };
    const player = Player.from(playerPrisma);
    expect(player.id).toBe(playerPrisma.id);
    expect(player.user.equals(User.from(playerPrisma.user))).toBe(true);
    expect(player.age).toBe(playerPrisma.age);
    expect(player.position).toBe(playerPrisma.position);
});