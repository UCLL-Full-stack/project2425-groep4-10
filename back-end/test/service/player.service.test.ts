import playerService from '../../service/player.service';
import playerDb from '../../domain/data-access/player.db';
import { Player } from '../../domain/model/player';
import { User } from '../../domain/model/user';
import { Role } from '../../types';

jest.mock('../../domain/data-access/player.db');

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

describe('Player Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllPlayers: should return all players', async () => {
        (playerDb.getAllPlayers as jest.Mock).mockResolvedValue([new Player(validPlayerData)]);

        const players = await playerService.getAllPlayers();

        expect(players).toHaveLength(1);
        expect(players[0].user.username).toBe(validUserData.username);
    });

    test('getPlayerById: should return player by id', async () => {
        (playerDb.getPlayerById as jest.Mock).mockResolvedValue(new Player(validPlayerData));

        const player = await playerService.getPlayerById({ id: validPlayerData.id });

        expect(player?.id).toBe(validPlayerData.id);
        expect(player?.user.username).toBe(validUserData.username);
    });

    test('getPlayerById: should return null if player does not exist', async () => {
        (playerDb.getPlayerById as jest.Mock).mockResolvedValue(null);

        const player = await playerService.getPlayerById({ id: validPlayerData.id });

        expect(player).toBeNull();
    });
});