import { Match } from '../model/match';
import database from '../../util/database'

const getAllMatches = async (): Promise<Match[]> => {
    try {
        const matchesPrisma = await database.match.findMany({
            include: {
                teams: {
                    include: {
                        coach: {
                            include: {
                                user: true
                            }
                        },
                        players: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });
        return matchesPrisma.map((matchPrisma) => Match.from(matchPrisma));
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
}

const getMatchById = async ({ id }: { id: number }): Promise<Match | null> => {
    try {
        const matchPrisma = await database.match.findUnique({
            where: { id },
            include: {
                teams: {
                    include: {
                        coach: {
                            include: {
                                user: true
                            }
                        },
                        players: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });
        return matchPrisma ? Match.from(matchPrisma) : null;
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
}

const createMatch = async ({ teamIds, dateTime, location }: { teamIds: number[], dateTime: Date, location: string }): Promise<Match> => {
    try {
        const matchPrisma = await database.match.create({
            data: {
                teams: {
                    connect: teamIds.map((id) => ({ id })),
                },
                dateTime: dateTime,
                location: location
            },
            include: {
                teams: {
                    include: {
                        coach: {
                            include: {
                                user: true
                            }
                        },
                        players: {
                            include: {
                                user: true
                            }
                        }
                    }
                }
            }
        });
        return Match.from(matchPrisma);
    } catch (error) {
        throw new Error('Database error. See server log for details.');
    }
}

export default {
    getAllMatches,
    getMatchById,
    createMatch
}