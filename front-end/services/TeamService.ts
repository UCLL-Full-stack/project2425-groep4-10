import { Team, Player } from "../types"

const getAllTeams = async (): Promise<Team[]> => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/teams", {
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + sessionStorage.getItem('token')
        }
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
};

const getTeamById = async (teamId: number): Promise<Team> => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `teams/${teamId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + sessionStorage.getItem('token')
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
            'authorization': 'Bearer ' + sessionStorage.getItem('token')
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



const addPlayerToTeam = async (teamId: number, playerId: number): Promise<void> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams/${teamId}/player`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
        body: JSON.stringify({ playerId })
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Network response was not ok:", response.statusText, errorText);
        throw new Error('Network response was not ok');
    }

    return response.json();
};

const addTeam = async ({ teamName, location, coach, players }: { teamName: string, location: string, coach: { id: number }, players: Array<{ id: number }> }): Promise<Team> => {
    const payload = {
        teamName,
        location,
        coach,
        players
    };
    console.log("Payload being sent:", payload);

    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/teams", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        console.error("Network response was not ok:", response.statusText);
        throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    console.log("Response received:", responseData);
    return responseData;
};

const updateTeam = async ({ id, teamName, location }: { id: number, teamName: string, location: string }): Promise<Team> => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/teams/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
        body: JSON.stringify({ teamName, location })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}


const TeamService = {
    getAllTeams,
    addPlayerToTeam,
    getTeamById,
    removePlayerFromTeam,
    addTeam,
    updateTeam
}

export default TeamService