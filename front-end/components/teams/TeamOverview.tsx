import React, { useState, useEffect } from "react";
import { Team, Coach, Player } from "@/types";
import coachService from "@/services/CoachService";
import playerService from "@/services/PlayerService";

type Props = {
    teams: Array<Team>;
    onRemovePlayer: (teamId: number, playerId: number) => void;
    onAddTeam: (teamName: string, location: string, coach: { id: number }, players: Array<{ id: number }>) => void;
    onEditTeam: (teamId: number, teamName: string, location: string) => void;
    onAddPlayer: (teamId: number, playerId: number) => void;
    loggedInUser: { role: string };
};

const TeamOverview: React.FC<Props> = ({
    teams,
    onRemovePlayer,
    onAddTeam,
    onEditTeam,
    onAddPlayer,
    loggedInUser,
}) => {
    const [newTeamName, setNewTeamName] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [newCoachId, setNewCoachId] = useState<number | null>(null);
    const [coaches, setCoaches] = useState<Array<Coach>>([]);
    const [players, setPlayers] = useState<Array<Player>>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
    const [editTeamName, setEditTeamName] = useState("");
    const [editLocation, setEditLocation] = useState("");

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const coachData = await coachService.getAllCoaches();
                const assignedCoachIds = teams.map((team) => team.coach.id);
                const availableCoaches = coachData.filter((coach) => !assignedCoachIds.includes(coach.id));
                setCoaches(availableCoaches);
            } catch (error) {
                console.error("Error fetching coaches:", error);
            }
        };

        const fetchPlayers = async () => {
            try {
                const playerData = await playerService.getAllPlayers();
                const assignedPlayerIds = teams.flatMap((team) => team.players.map((player) => player.id));
                const availablePlayers = playerData.filter((player) => !assignedPlayerIds.includes(player.id));
                setPlayers(availablePlayers);
            } catch (error) {
                console.error("Error fetching players:", error);
            }
        };

        fetchCoaches();
        fetchPlayers();
    }, [teams]);

    const handlePlayerDelete = (teamId: number, playerId: number) => {
        onRemovePlayer(teamId, playerId);
    };

    const handleAddTeam = () => {
        if (newTeamName && newLocation && newCoachId !== null) {
            onAddTeam(newTeamName, newLocation, { id: newCoachId }, []);
            setNewTeamName("");
            setNewLocation("");
            setNewCoachId(null);
        }
    };

    const handleEditTeam = () => {
        if (selectedTeamId !== null && editTeamName && editLocation) {
            onEditTeam(selectedTeamId, editTeamName, editLocation);
            setSelectedTeamId(null);
            setEditTeamName("");
            setEditLocation("");
        }
    };

    const handleAddPlayer = (teamId: number, playerId: number) => {
        try {
            onAddPlayer(teamId, playerId);
        } catch (error) {
            console.error("Error adding player to team:", error);
        }
    };

    return (
        <div className="p-4 bg-gray-100">
            {/* Admin Actions */}
            {loggedInUser.role === "admin" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Add New Team Section */}
                    <div className="p-4 bg-white border rounded shadow">
                        <h2 className="text-lg font-bold mb-4">Add New Team</h2>
                        <input
                            type="text"
                            placeholder="Team Name"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                            className="mb-2 p-2 border rounded w-full"
                        />
                        <select
                            value={newCoachId ?? ""}
                            onChange={(e) => setNewCoachId(Number(e.target.value))}
                            className="mb-2 p-2 border rounded w-full"
                        >
                            <option value="" disabled>
                                Select Coach
                            </option>
                            {coaches.map((coach) => (
                                <option key={coach.id} value={coach.id}>
                                    {coach.user.username}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleAddTeam}
                            className="p-2 bg-blue-500 text-white rounded w-full"
                        >
                            Add Team
                        </button>
                    </div>
                </div>
            )}

            {/* Teams Section */}
            <div className="p-4 bg-white border rounded shadow">
                <h2 className="text-lg font-bold mb-4">Teams</h2>
                <table className="w-full bg-white border">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                        <tr>
                            <th className="py-2 px-4 text-left">Team Name</th>
                            <th className="py-2 px-4 text-left">Coach</th>
                            <th className="py-2 px-4 text-left">Location</th>
                            <th className="py-2 px-4 text-left">Players</th>
                            <th className="py-2 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team) => (
                            <React.Fragment key={team.id}>
                                <tr
                                    className={`hover:bg-gray-100 ${selectedTeamId === team.id ? "bg-gray-50" : ""
                                        }`}
                                    onClick={() => setSelectedTeamId(selectedTeamId === team.id ? null : team.id)}
                                >
                                    <td className="py-2 px-4">{team.teamName}</td>
                                    <td className="py-2 px-4">{team.coach.user.username}</td>
                                    <td className="py-2 px-4">{team.location}</td>
                                    <td className="py-2 px-4">
                                        {team.players.length > 0
                                            ? `${team.players.length} Players`
                                            : "No Players"}
                                    </td>
                                    <td className="py-2 px-4">
                                        {loggedInUser.role === "admin" && (
                                            <button
                                                className="text-blue-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditTeamName(team.teamName);
                                                    setEditLocation(team.location);
                                                    setSelectedTeamId(team.id);
                                                }}
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </td>
                                </tr>
                                {selectedTeamId === team.id && (
                                    <tr>
                                        <td colSpan={5} className="p-4 bg-gray-50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* Edit Team */}
                                                <div>
                                                    <h3 className="text-lg font-bold mb-2">Edit Team</h3>
                                                    <input
                                                        type="text"
                                                        value={editTeamName}
                                                        onChange={(e) => setEditTeamName(e.target.value)}
                                                        className="mb-2 p-2 border rounded w-full"
                                                        placeholder="Team Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editLocation}
                                                        onChange={(e) => setEditLocation(e.target.value)}
                                                        className="mb-2 p-2 border rounded w-full"
                                                        placeholder="Location"
                                                    />
                                                    <button
                                                        onClick={handleEditTeam}
                                                        className="p-2 bg-green-500 text-white rounded w-full"
                                                    >
                                                        Save Changes
                                                    </button>
                                                </div>

                                                {/* Player Management */}
                                                <div>
                                                    <h3 className="text-lg font-bold mb-2">Players in Team</h3>
                                                    {team.players.length > 0 ? (
                                                        <table className="w-full border">
                                                            <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                                                                <tr>
                                                                    <th className="py-2 px-4">Player Name</th>
                                                                    <th className="py-2 px-4">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {team.players.map((player) => (
                                                                    <tr key={player.id} className="border-b">
                                                                        <td className="py-2 px-4">{player.user.username}</td>
                                                                        <td className="py-2 px-4">
                                                                            {loggedInUser.role === "admin" && (
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handlePlayerDelete(team.id, player.id)
                                                                                    }
                                                                                    className="text-red-500"
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p className="text-gray-500">No players in this team.</p>
                                                    )}

                                                    <h3 className="text-lg font-bold mt-4 mb-2">Add Players</h3>
                                                    <table className="w-full border">
                                                        <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                                                            <tr>
                                                                <th className="py-2 px-4">Player Name</th>
                                                                <th className="py-2 px-4">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {players.map((player) => (
                                                                <tr key={player.id} className="border-b">
                                                                    <td className="py-2 px-4">{player.user.username}</td>
                                                                    <td className="py-2 px-4">
                                                                        <button
                                                                            onClick={() => handleAddPlayer(team.id, player.id)}
                                                                            className="text-blue-500"
                                                                        >
                                                                            Add
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeamOverview;
