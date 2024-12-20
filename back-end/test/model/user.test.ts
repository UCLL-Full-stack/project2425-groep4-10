import { User } from '../../domain/model/user';
import { Role } from '../../types';

const validUserData = {
    id: 1,
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'admin' as Role
};

test('given: valid user data, when: user is created, then: user is created with those values', () => {
    const user = new User(validUserData);

    expect(user.id).toBe(validUserData.id);
    expect(user.username).toBe(validUserData.username);
    expect(user.firstName).toBe(validUserData.firstName);
    expect(user.lastName).toBe(validUserData.lastName);
    expect(user.email).toBe(validUserData.email);
    expect(user.password).toBe(validUserData.password);
    expect(user.role).toBe(validUserData.role);
});

test('given: invalid username, when: user is created, then: an error is thrown', () => {
    expect(() => {
        new User({ ...validUserData, username: '' });
    }).toThrow("User must have a username");
});

test('given: invalid firstName, when: user is created, then: an error is thrown', () => {
    expect(() => {
        new User({ ...validUserData, firstName: '' });
    }).toThrow("User must have a first name");
});

test('given: invalid lastName, when: user is created, then: an error is thrown', () => {
    expect(() => {
        new User({ ...validUserData, lastName: '' });
    }).toThrow("User must have a last name");
});

test('given: invalid email, when: user is created, then: an error is thrown', () => {
    expect(() => {
        new User({ ...validUserData, email: '' });
    }).toThrow("User must have an email");
});

test('given: invalid password, when: user is created, then: an error is thrown', () => {
    expect(() => {
        new User({ ...validUserData, password: '' });
    }).toThrow("User must have a password");
});

test('given: invalid role, when: user is created, then: an error is thrown', () => {
    expect(() => {
        new User({ ...validUserData, role: undefined as unknown as Role });
    }).toThrow("User must have a role");
});

test('given: two equal users, when: compared, then: they are equal', () => {
    const user1 = new User(validUserData);
    const user2 = new User(validUserData);
    expect(user1.equals(user2)).toBe(true);
});

test('given: two different users, when: compared, then: they are not equal', () => {
    const user1 = new User(validUserData);
    const user2 = new User({ ...validUserData, username: 'differentuser' });
    expect(user1.equals(user2)).toBe(false);
});

test('given: UserPrisma object, when: User is created from it, then: User is created with those values', () => {
    const userPrisma = {
        id: 1,
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'admin' as Role
    };
    const user = User.from(userPrisma);
    expect(user.id).toBe(userPrisma.id);
    expect(user.username).toBe(userPrisma.username);
    expect(user.firstName).toBe(userPrisma.firstName);
    expect(user.lastName).toBe(userPrisma.lastName);
    expect(user.email).toBe(userPrisma.email);
    expect(user.password).toBe(userPrisma.password);
    expect(user.role).toBe(userPrisma.role);
});