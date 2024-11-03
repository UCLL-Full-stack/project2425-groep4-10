export type Player = {
    id: number
    user: User
    position: string
    age: number
    teams: Team[]
}

export type Coach = {
    id: number
    user: User
    rating: number
    experience: number
    team: Team
}

export type Team = {
    id: number
    teamName: string
    location: string
    coach: Coach
    players: Player[]
}

export type User = {
    firstName?: string
    lastName?: string
    email?: string
    username?: string
    password?: string
}

export type Parent = {
    sex: string
}

export type Match = {
    id: number
    dateTime: Date
    location: string
    teams: Team[]
}

export type StatusMessage = {
    message: string
    type: "error" | "success"
}
