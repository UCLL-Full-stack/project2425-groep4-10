import { Team } from "./team";
import { Team as TeamPrisma } from '@prisma/client';
import { Match as MatchPrisma } from '@prisma/client';
import { Coach as CoachPrisma } from '@prisma/client';
import { Player as PlayerPrisma } from '@prisma/client';
import { User as UserPrisma } from '@prisma/client';


export class Match {
    readonly id?: number;
    readonly teams: Team[];
    readonly dateTime: Date;
    readonly location: string;

    constructor(match: {
        id?: number,
        teams: Team[],
        dateTime: Date,
        location: string
    }) {
        this.validate(match);

        this.id = match.id;
        this.teams = match.teams;
        this.dateTime = match.dateTime;
        this.location = match.location;

    }

    validate(match: {
        teams: Team[],
        dateTime: Date,
        location: string
    }) {
        if (!match.teams) {
            throw new Error('Match must have teams');
        }
        if (!match.dateTime) {
            throw new Error('Match must have a date and time');
        }
        if (!match.location) {
            throw new Error('Match must have a location');
        }

    }

    static from({ id, teams, dateTime, location }: MatchPrisma & { teams: (TeamPrisma & { coach: CoachPrisma & { user: UserPrisma }; players: (PlayerPrisma & { user: UserPrisma })[] })[] }): Match {
        return new Match({
            id,
            teams: teams.map(team => Team.from(team)),
            dateTime,
            location,
        });
    }
}