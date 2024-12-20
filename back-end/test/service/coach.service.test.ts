import coachService from '../../service/coach.service';
import coachDb from '../../domain/data-access/coach.db';
import { Coach } from '../../domain/model/coach';
import { User } from '../../domain/model/user';
import { Role } from '../../types';

jest.mock('../../domain/data-access/coach.db');

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

describe('Coach Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getAllCoaches: should return all coaches', async () => {
        (coachDb.getAllCoaches as jest.Mock).mockResolvedValue([new Coach(validCoachData)]);

        const coaches = await coachService.getAllCoaches();

        expect(coaches).toHaveLength(1);
        expect(coaches[0].user.username).toBe(validUserData.username);
    });

    test('getCoachById: should return coach by id', async () => {
        (coachDb.getCoachById as jest.Mock).mockResolvedValue(new Coach(validCoachData));

        const coach = await coachService.getCoachById({ id: validCoachData.id });

        expect(coach?.id).toBe(validCoachData.id);
        expect(coach?.user.username).toBe(validUserData.username);
    });

    test('getCoachById: should return null if coach does not exist', async () => {
        (coachDb.getCoachById as jest.Mock).mockResolvedValue(null);

        const coach = await coachService.getCoachById({ id: validCoachData.id });

        expect(coach).toBeNull();
    });
});