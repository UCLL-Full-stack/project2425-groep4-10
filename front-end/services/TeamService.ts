import { Team, Player } from "../types"

const getAllTeams = async (): Promise<Response> => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/teams', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
};

const getTeamById = async (teamId: number): Promise<Team> => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `teams/${teamId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => {
        if (!res.ok) {
            alert("network error");
            return null;
        }
        return res;
    }).then(res => {
        if (res === null) {
            return null;
        }
        return res.json();
    }).catch(error => {
        console.error("Fetch error:", error);
        return null;
    });
}

const removePlayerFromTeam = (teamId: number, playerId: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}/player`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId })
    })
        .then(res => {
            if (!res.ok) {
                alert("network error");
                return null;
            }
            return res.json();
        })
        .catch(error => {
            console.error("Fetch error:", error);
            return null;
        });
};



const addPlayerToTeam = (teamId: number, playerId: number) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `teams/${teamId}/player`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team: { id: teamId }, players: [{ id: playerId }] })
    }).then(res => {
        if (!res.ok) {
            alert("network error");
            return null;
        }
        return res;
    }).then(res => {
        if (res === null) {
            return null;
        }
        return res.json();
    }).catch(error => {
        console.error("Fetch error:", error);
        return null;
    });
}

const TeamService = {
    getAllTeams,
    addPlayerToTeam,
    getTeamById,
    removePlayerFromTeam,
}

export default TeamService