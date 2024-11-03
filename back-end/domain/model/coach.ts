import { User } from "./user";
import { User as UserPrisma } from '@prisma/client';
import { Coach as CoachPrisma } from '@prisma/client';

export class Coach {
    readonly id?: number;
    readonly user: User;
    readonly rating: number;
    readonly experience: number;

    constructor(coach: {
        id?: number,
        user: User,
        rating: number,
        experience: number,
    }) {
        this.validate(coach);

        this.id = coach.id;
        this.user = coach.user;
        this.rating = coach.rating;
        this.experience = coach.experience;

    }

    equals({ id, user, rating, experience }: Coach): boolean {
        return (
            this.id === id &&
            this.user.equals(user) &&
            this.rating === rating &&
            this.experience === experience
        );
    }

    validate(coach: {
        user: User,
        rating: number,
        experience: number,
    }) {
        if (!coach.user) {
            throw new Error('Coach must have a user');
        }
        if (!coach.rating) {
            throw new Error('Coach must have a rating');
        }
        if (!coach.experience) {
            throw new Error('Coach must have an experience');
        }


    }

    static from({ id, user, rating, experience }: CoachPrisma & { user: UserPrisma }) {
        return new Coach({ id, user: User.from(user), rating, experience });
    }
}