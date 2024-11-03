import React from "react";
import { Team } from "@/types";
import styles from "../../styles/TeamOverview.module.css";

type Props = {
    teams: Array<Team>;
    onRemovePlayer: (teamId: number, playerId: number) => void;
};

const TeamOverview: React.FC<Props> = ({ teams, onRemovePlayer }) => {
    // Function to handle removing a player when clicking the delete button
    const handlePlayerDelete = (teamId: number, playerId: number) => {
        onRemovePlayer(teamId, playerId);
    };

    return (
        <>
            {teams && (
                <div className={styles.teamOverview}>
                    <div className={styles.tableContainer}>
                        <table className={styles.teamTable}>
                            <caption><b>TEAMS</b></caption>
                            <thead>
                                <tr>
                                    <th>Team Name</th>
                                    <th>Coach</th>
                                    <th>Location</th>
                                    <th>Players</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teams.map((team) => (
                                    <tr key={team.id}>
                                        <td>{team.teamName}</td>
                                        <td>{team.coach.user.username}</td>
                                        <td>{team.location}</td>
                                        <td>
                                            {team.players && team.players.length > 0
                                                ? team.players.map((player) => (
                                                    <span key={player.id} className={styles.playerContainer}>
                                                        <span>{player.user.username}</span>
                                                        <button
                                                            className={styles.deleteButton}
                                                            onClick={() => handlePlayerDelete(team.id, player.id)}
                                                        >
                                                            ❌
                                                        </button>
                                                    </span>
                                                ))
                                                : "No players yet"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default TeamOverview;
