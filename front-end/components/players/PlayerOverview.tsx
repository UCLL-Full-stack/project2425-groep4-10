import PlayerService from "@/services/PlayerService"
import TeamService from "@/services/TeamService"
import { Player, Team, User } from "@/types"
import { useState } from "react"
import useSWR from "swr"

type props = {
    id: string
}

const PlayerOverview: React.FC<props> = ({ id }) => {

    const [players, setPlayers] = useState([])

    const [team, setTeam] = useState<any>()

    const fetcher = async () => {
        const players = await PlayerService.getAllPlayers()
        if (!players) {
            return
        }
        setPlayers(players)

        const team = await TeamService.getTeamById(Number(id))
        if (!team) {
            return
        }
        setTeam(team)
    }


    const playerInTeam = (id: number) => {
        if (!team) return
        console.log(team.players.map(p => p.id))
        console.log(id)
        return team.players.map(p => p.id).includes(id)
    }


    const { data, error } = useSWR("/players", fetcher)


    return (
        <>

            <section className="mt-5">
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Position</th>
                            <th></th>
                        </tr>
                    </thead>
                    {players && players.map(p => {
                        return (
                            <tbody>
                                <tr>
                                    <td>{p.user.firstName + " " + p.user.lastName}</td>
                                    <td>{p.position}</td>
                                    <td>{p.age}</td>
                                </tr>
                            </tbody>
                        )
                    })}

                </table>
            </section>
        </>
    )
}

export default PlayerOverview
