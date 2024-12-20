const getAllPlayers = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/players", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
    }).then(res => {
        if (!res.ok) {
            alert("network error")
            return null
        }
        return res
    }).then(res => {
        if (res) {
            return res.json()
        }
        return null
    })
}

const getPlayerById = (playerId: number) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/players/" + playerId, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'authorization': 'Bearer ' + sessionStorage.getItem('token')
        },
    }).then(res => {
        if (!res.ok) {
            alert("network error")
            return null
        }
        return res
    }).then(res => {
        if (res) {
            return res.json()
        }
        return null
    })
}
const PlayerService = {
    getAllPlayers,
    getPlayerById
}

export default PlayerService