import matchDb from "../domain/data-access/match.db";
import { Match } from "../domain/model/match";

const getAllMatches = async (): Promise<Match[]> => {
    return matchDb.getAllMatches();
}

const getMatchById = async ({ id }: { id: number }): Promise<Match | null> => {
    return matchDb.getMatchById({ id });
}

export default {
    getAllMatches,
    getMatchById,
}
