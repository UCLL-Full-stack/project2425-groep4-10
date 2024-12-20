import { Parent } from '../../domain/model/parent';
import { User } from '../../domain/model/user';
import { Role } from '../../types';

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

test('given: valid parent data, when: parent is created, then: parent is created with those values', () => {
    const parent = new Parent(validParentData);

    expect(parent.id).toBe(validParentData.id);
    expect(parent.user.equals(validParentData.user)).toBe(true);
    expect(parent.sex).toBe(validParentData.sex);
});

test('given: invalid user, when: parent is created, then: an error is thrown', () => {
    expect(() => {
        new Parent({ ...validParentData, user: null as unknown as User });
    }).toThrow("Parent must have a user");
});

test('given: invalid sex, when: parent is created, then: an error is thrown', () => {
    expect(() => {
        new Parent({ ...validParentData, sex: '' });
    }).toThrow("Parent must have a gender");
});

test('given: two equal parents, when: compared, then: they are equal', () => {
    const parent1 = new Parent(validParentData);
    const parent2 = new Parent(validParentData);
    expect(parent1.equals(parent2)).toBe(true);
});

test('given: two different parents, when: compared, then: they are not equal', () => {
    const parent1 = new Parent(validParentData);
    const parent2 = new Parent({ ...validParentData, sex: 'male' });
    expect(parent1.equals(parent2)).toBe(false);
});

test('given: ParentPrisma object, when: Parent is created from it, then: Parent is created with those values', () => {
    const parentPrisma = {
        id: 1,
        userId: 1,
        user: validUserData,
        sex: 'female'
    };
    const parent = Parent.from(parentPrisma);
    expect(parent.id).toBe(parentPrisma.id);
    expect(parent.user.equals(User.from(parentPrisma.user))).toBe(true);
    expect(parent.sex).toBe(parentPrisma.sex);
});