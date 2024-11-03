import { User as UserPrisma } from '@prisma/client'

export class User {
    readonly id?: number;
    readonly username: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;

    constructor(user: {
        id?: number,
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;

    }

    equals({ id, username, firstName, lastName, email, password }: User): boolean {
        return (
            this.id === id &&
            this.username === username &&
            this.firstName === firstName &&
            this.lastName === lastName &&
            this.email === email &&
            this.password === password
        );
    }

    validate(user: {
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string
    }) {
        if (!user.username) {
            throw new Error('User must have a username');
        }
        if (!user.firstName) {
            throw new Error('User must have a first name');
        }
        if (!user.lastName) {
            throw new Error('User must have a last name');
        }
        if (!user.email) {
            throw new Error('User must have an email');
        }
        if (!user.password) {
            throw new Error('User must have a password');
        }

    }

    static from({ id, username, firstName, lastName, email, password }: UserPrisma): User {
        return new User({ id, username, firstName, lastName, email, password });
    }
}