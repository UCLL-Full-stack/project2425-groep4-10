import { Match, Player } from "../types"

const getAllMatches = async (): Promise<Match[]> => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/matches", {
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

const getMatchById = async (matchId: number): Promise<Match> => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + `/matches/${matchId}`, {
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

const createMatch = async ({ teamIds, dateTime, location }: { teamIds: number[], dateTime: string, location: string }): Promise<Match | null> => {
    const formattedDateTime = new Date(dateTime).toISOString();
    const payload = { teamIds, dateTime: formattedDateTime, location };
    console.log("Sending payload to server:", payload);

    return fetch(process.env.NEXT_PUBLIC_API_URL + `/matches`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
        body: JSON.stringify(payload)
    }).then(res => {
        if (!res.ok) {
            const errorText = res.statusText;
            console.error("Network response was not ok:", errorText);
            alert("Network error: " + errorText);
            return null;
        }
        return res.json();
    }).catch(error => {
        console.error("Fetch error:", error);
        return null;
    });
}

const MatchService = {
    getAllMatches,
    getMatchById,
    createMatch
}

export default MatchService