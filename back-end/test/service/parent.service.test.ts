import parentService from '../../service/parent.service';
import parentDb from '../../domain/data-access/parent.db';
import { Parent } from '../../domain/model/parent';
import { User } from '../../domain/model/user';
import { Role } from '../../types';

jest.mock('../../domain/data-access/parent.db');

const validUserData = {
    id: 1,
    username: 'parentuser',
    firstName: 'Parent',
    lastName: 'User',
    email: 'parent@example.com',
    password: 'password123',
    role: 'parent' as Role
};

const validParentData = {
    id: 1,
    user: new User(validUserData),
    sex: 'female'
};

describe('Parent Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllParents: should return all parents', async () => {
        (parentDb.getAllParents as jest.Mock).mockResolvedValue([new Parent(validParentData)]);

        const parents = await parentService.getAllParents();

        expect(parents).toHaveLength(1);
        expect(parents[0].user.username).toBe(validUserData.username);
    });

    test('getParentById: should return parent by id', async () => {
        (parentDb.getParentById as jest.Mock).mockResolvedValue(new Parent(validParentData));

        const parent = await parentService.getParentById({ id: validParentData.id });

        expect(parent?.id).toBe(validParentData.id);
        expect(parent?.user.username).toBe(validUserData.username);
    });

    test('getParentById: should return null if parent does not exist', async () => {
        (parentDb.getParentById as jest.Mock).mockResolvedValue(null);

        const parent = await parentService.getParentById({ id: validParentData.id });

        expect(parent).toBeNull();
    });
});