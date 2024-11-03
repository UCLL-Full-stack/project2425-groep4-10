import playerDb from "../domain/data-access/player.db";
import { Player } from "../domain/model/player";

const getAllPlayers = async (): Promise<Player[]> => {
    return playerDb.getAllPlayers();
}

const getPlayerById = async ({ id }: { id: number }): Promise<Player | null> => {
    return playerDb.getPlayerById({ id });
}

export default {
    getAllPlayers,
    getPlayerById
}