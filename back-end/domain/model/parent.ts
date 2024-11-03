import { User } from "./user";
import { User as UserPrisma } from '@prisma/client';
import { Parent as ParentPrisma } from '@prisma/client';

export class Parent {
    readonly id?: number;
    readonly user: User;
    readonly sex: string;

    constructor(parent: {
        id?: number,
        user: User
        sex: string
    }) {
        this.validate(parent);

        this.id = parent.id;
        this.user = parent.user;
        this.sex = parent.sex;

    }

    equals({ id, user, sex }: Parent): boolean {
        return (
            this.id === id &&
            this.sex === sex &&
            this.user.equals(user)

        );
    }

    validate(parent: {
        user: User,
        sex: string
    }) {
        if (!parent.user) {
            throw new Error('Parent must have a user');
        }
        if (!parent.sex) {
            throw new Error('Parent must have a gender');
        }
    }

    static from({ id, user, sex }: ParentPrisma & ({ user: UserPrisma })) {
        return new Parent({ id, user: User.from(user), sex });
    }
}