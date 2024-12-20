const getAllCoaches = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/coaches", {
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

const CoachService = {
    getAllCoaches,
}

export default CoachService