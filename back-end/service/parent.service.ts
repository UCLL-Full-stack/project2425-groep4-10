import parentDb from "../domain/data-access/parent.db";
import { Parent } from "../domain/model/parent";

const getAllParents = async (): Promise<Parent[]> => {
    return parentDb.getAllParents();
}

const getParentById = async ({ id }: { id: number }): Promise<Parent | null> => {
    return parentDb.getParentById({ id });
}

export default {
    getAllParents,
    getParentById
}