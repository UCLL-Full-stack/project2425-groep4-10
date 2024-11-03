import coachDb from "../domain/data-access/coach.db";
import { Coach } from "../domain/model/coach";

const getAllCoaches = async (): Promise<Coach[]> => {
    return coachDb.getAllCoaches();
}

const getCoachById = async ({ id }: { id: number }): Promise<Coach | null> => {
    return coachDb.getCoachById({ id });
}


export default {
    getAllCoaches,
    getCoachById
}