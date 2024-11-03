import { Team } from "./team";
import { User } from "./user";
import { Player as PlayerPrisma } from '@prisma/client';
import { User as UserPrisma } from '@prisma/client';
import { Team as TeamPrisma } from '@prisma/client';
import { Coach as CoachPrisma } from '@prisma/client';

export class Player {
    readonly id?: number;
    readonly user: User;
    readonly age: number;
    readonly position: string;

    constructor(player: { id?: number; user: User; age: number; position: string; }) {
        this.validate(player);

        this.id = player.id;
        this.user = player.user;
        this.age = player.age;
        this.position = player.position;
    }

    equals({ id, user, age, position }: Player): boolean {
        return (
            this.id === id &&
            this.user.equals(user) &&
            this.age === age &&
            this.position === position
        );
    }

    validate(player: { user: User; age: number; position: string; }) {
        if (!player.user) {
            throw new Error('Player must have a user');
        }
        if (!player.age) {
            throw new Error('Player must have an age');
        }
        if (!player.position) {
            throw new Error('Player must have a position');
        }
    }

    static from({ id, user, age, position }: PlayerPrisma & { user: UserPrisma }) {
        return new Player({
            id,
            user: User.from(user),
            age,
            position,
        });
    }
}