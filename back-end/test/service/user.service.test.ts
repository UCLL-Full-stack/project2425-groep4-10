import bcrypt from 'bcrypt';
import userService from '../../service/user.service';
import userDB from '../../domain/data-access/user.db';
import { User } from '../../domain/model/user';
import { generateJwtToken } from '../../util/jwt';
import { Role, AuthenticationResponse, UserInput } from '../../types';

jest.mock('bcrypt');
jest.mock('../../domain/data-access/user.db');
jest.mock('../../util/jwt');

const validUserData = {
    id: 1,
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashedpassword123',
    role: 'admin' as Role
};

const validUserInput: UserInput = {
    username: 'johndoe',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'admin' as Role
};

describe('User Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllUsers: should return all users', async () => {
        (userDB.getAllUsers as jest.Mock).mockResolvedValue([new User(validUserData)]);

        const users = await userService.getAllUsers();

        expect(users).toHaveLength(1);
        expect(users[0].username).toBe(validUserData.username);
    });

    test('getUserByUsername: should return user by username', async () => {
        (userDB.getUserByUsername as jest.Mock).mockResolvedValue(new User(validUserData));

        const user = await userService.getUserByUsername({ username: validUserData.username });

        expect(user.username).toBe(validUserData.username);
    });

    test('getUserByUsername: should throw error if user does not exist', async () => {
        (userDB.getUserByUsername as jest.Mock).mockResolvedValue(null);

        await expect(userService.getUserByUsername({ username: validUserData.username }))
            .rejects
            .toThrow(`User with username: ${validUserData.username} does not exist.`);
    });

    test('authenticate: should return authentication response for valid credentials', async () => {
        (userDB.getUserByUsername as jest.Mock).mockResolvedValue(new User(validUserData));
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (generateJwtToken as jest.Mock).mockReturnValue('mockedToken');

        const response: AuthenticationResponse = await userService.authenticate(validUserInput);

        expect(response.token).toBe('mockedToken');
        expect(response.username).toBe(validUserData.username);
        expect(response.fullname).toBe(`${validUserData.firstName} ${validUserData.lastName}`);
        expect(response.role).toBe(validUserData.role);
    });

    test('authenticate: should throw error for invalid password', async () => {
        (userDB.getUserByUsername as jest.Mock).mockResolvedValue(new User(validUserData));
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(userService.authenticate(validUserInput))
            .rejects
            .toThrow('Incorrect password.');
    });

    test('createUser: should create a new user', async () => {
        (userDB.getUserByUsername as jest.Mock).mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword123');
        (userDB.createUser as jest.Mock).mockResolvedValue(new User(validUserData));

        const user = await userService.createUser(validUserInput);

        expect(user.username).toBe(validUserData.username);
        expect(user.password).toBe('hashedpassword123');
    });

    test('createUser: should throw error if user already exists', async () => {
        (userDB.getUserByUsername as jest.Mock).mockResolvedValue(new User(validUserData));

        await expect(userService.createUser(validUserInput))
            .rejects
            .toThrow(`User with username ${validUserData.username} is already registered.`);
    });
});