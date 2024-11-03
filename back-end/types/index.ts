type UserInput = {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

type CoachInput = {
    id?: number;
    user: UserInput;
    rating: number;
    experience: number;
}

type PlayerInput = {
    id?: number;
    user: UserInput;
    position: string;
    age: number;
}

type ParentInput = {
    id?: number;
    user: UserInput;
    sex: string;
}

type TeamInput = {
    id?: number;
    teamName: string;
    location: string;
    coach: CoachInput;
    players: PlayerInput[];
}

type MatchInput = {
    id?: number;
    teams: TeamInput[];
    dateTime: Date;
    location: string;
}

export type { UserInput, CoachInput, PlayerInput, ParentInput, TeamInput, MatchInput };