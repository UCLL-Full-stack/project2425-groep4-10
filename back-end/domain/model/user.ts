import { User as UserPrisma } from '@prisma/client'
import { Role } from '../../types'

export class User {
    readonly id?: number;
    readonly username: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
    readonly role: Role


    constructor(user: {
        id?: number,
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string
        role: Role
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;

    }

    equals({ id, username, firstName, lastName, email, password, role }: User): boolean {
        return (
            this.id === id &&
            this.username === username &&
            this.firstName === firstName &&
            this.lastName === lastName &&
            this.email === email &&
            this.password === password &&
            this.role === role

        );
    }

    validate(user: {
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        role: Role
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
        if (!user.role) {
            throw new Error('User must have a role');
        }

    }

    static from({ id, username, firstName, lastName, email, password, role }: UserPrisma): User {
        return new User({
            id, username, firstName, lastName, email, password, role: role as Role,
        });
    }
}