import { Team as TeamPrisma } from '@prisma/client';
import { Coach as CoachPrisma } from '@prisma/client';
import { Player as PlayerPrisma } from '@prisma/client';
import { User as UserPrisma } from '@prisma/client';
import { Coach } from './coach';
import { Player } from './player';

export class Team {
    readonly id?: number;
    readonly teamName: string;
    readonly location: string;
    readonly coach: Coach;
    readonly players: Player[];

    constructor(team: { id?: number; teamName: string; location: string; coach: Coach; players: Player[] }) {
        this.validate(team);

        this.id = team.id;
        this.teamName = team.teamName;
        this.location = team.location;
        this.coach = team.coach;
        this.players = team.players;
    }

    equals({ id, teamName, location, coach, players }: Team): boolean {
        return (
            this.id === id &&
            this.teamName === teamName &&
            this.location === location &&
            this.coach.equals(coach) &&
            this.players.every((player, index) => player.equals(players[index]))
        );
    }

    validate(team: { teamName: string; location: string }) {
        if (!team.teamName) {
            throw new Error('Team must have a name');
        }
        if (!team.location) {
            throw new Error('Team must have a location');
        }
    }

    static from({ id, teamName, location, coach, players }: TeamPrisma & { coach: CoachPrisma & { user: UserPrisma }; players: (PlayerPrisma & { user: UserPrisma })[] }): Team {
        return new Team({
            id,
            teamName,
            location,
            coach: Coach.from(coach),
            players: players.map(player => Player.from(player))
        });
    }
}