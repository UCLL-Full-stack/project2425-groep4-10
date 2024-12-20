import matchDb from "../domain/data-access/match.db";
import { Match } from "../domain/model/match";
import { Team } from "../domain/model/team";


const getAllMatches = async (): Promise<Match[]> => {
    return matchDb.getAllMatches();
}

const getMatchById = async ({ id }: { id: number }): Promise<Match | null> => {
    return matchDb.getMatchById({ id });
}


const createMatch = async ({ teamIds, dateTime, location }: { teamIds: number[], dateTime: Date, location: string }): Promise<Match> => {
    return matchDb.createMatch({ teamIds, dateTime, location });
}

export default {
    getAllMatches,
    getMatchById,
    createMatch
}
