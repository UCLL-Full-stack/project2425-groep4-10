import { Coach } from '../../domain/model/coach';
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

test('given: valid coach data, when: coach is created, then: coach is created with those values', () => {
    const coach = new Coach(validCoachData);

    expect(coach.id).toBe(validCoachData.id);
    expect(coach.user.equals(validCoachData.user)).toBe(true);
    expect(coach.rating).toBe(validCoachData.rating);
    expect(coach.experience).toBe(validCoachData.experience);
});

test('given: invalid user, when: coach is created, then: an error is thrown', () => {
    expect(() => {
        new Coach({ ...validCoachData, user: null as unknown as User });
    }).toThrow("Coach must have a user");
});

test('given: invalid rating, when: coach is created, then: an error is thrown', () => {
    expect(() => {
        new Coach({ ...validCoachData, rating: null as unknown as number });
    }).toThrow("Coach must have a rating");
});

test('given: invalid experience, when: coach is created, then: an error is thrown', () => {
    expect(() => {
        new Coach({ ...validCoachData, experience: null as unknown as number });
    }).toThrow("Coach must have an experience");
});

test('given: two equal coaches, when: compared, then: they are equal', () => {
    const coach1 = new Coach(validCoachData);
    const coach2 = new Coach(validCoachData);
    expect(coach1.equals(coach2)).toBe(true);
});

test('given: two different coaches, when: compared, then: they are not equal', () => {
    const coach1 = new Coach(validCoachData);
    const coach2 = new Coach({ ...validCoachData, rating: 4 });
    expect(coach1.equals(coach2)).toBe(false);
});

test('given: CoachPrisma object, when: Coach is created from it, then: Coach is created with those values', () => {
    const coachPrisma = {
        id: 1,
        userId: 1,
        user: validUserData,
        rating: 5,
        experience: 10
    };
    const coach = Coach.from(coachPrisma);
    expect(coach.id).toBe(coachPrisma.id);
    expect(coach.user.equals(User.from(coachPrisma.user))).toBe(true);
    expect(coach.rating).toBe(coachPrisma.rating);
    expect(coach.experience).toBe(coachPrisma.experience);
});