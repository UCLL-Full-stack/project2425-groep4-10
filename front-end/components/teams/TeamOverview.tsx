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
        <div className="p-6 bg-gray-100 space-y-6">
            {loggedInUser.role === "admin" && (
                <div className="p-6 bg-white border rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Add New Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <input
                            type="text"
                            placeholder="Team Name"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            className="p-3 border rounded w-full"
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                            className="p-3 border rounded w-full"
                        />
                        <select
                            value={newCoachId ?? ""}
                            onChange={(e) => setNewCoachId(Number(e.target.value))}
                            className="p-3 border rounded w-full"
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
                    </div>
                    <button
                        onClick={handleAddTeam}
                        className="mt-4 p-3 bg-blue-600 text-white rounded w-full hover:bg-blue-700"
                    >
                        Add Team
                    </button>
                </div>
            )}

            <div className="p-6 bg-white border rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Teams</h2>
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-left text-sm text-gray-600 uppercase">
                            <th className="py-3 px-4">Team Name</th>
                            <th className="py-3 px-4">Coach</th>
                            <th className="py-3 px-4">Location</th>
                            <th className="py-3 px-4">Players</th>
                            <th className="py-3 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team) => (
                            <React.Fragment key={team.id}>
                                <tr className={`hover:bg-gray-100 ${selectedTeamId === team.id ? "bg-gray-50" : ""}`}>
                                    <td className="py-3 px-4">{team.teamName}</td>
                                    <td className="py-3 px-4">{team.coach.user.username}</td>
                                    <td className="py-3 px-4">{team.location}</td>
                                    <td className="py-3 px-4">
                                        {team.players.length > 0
                                            ? `${team.players.length} Players`
                                            : "No Players"}
                                    </td>
                                    <td className="py-3 px-4">
                                        {loggedInUser.role === "admin" && (
                                            <button
                                                className="text-blue-600 hover:underline"
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
                                        <td colSpan={5} className="bg-gray-50 p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-4">Edit Team</h3>
                                                    <input
                                                        type="text"
                                                        value={editTeamName}
                                                        onChange={(e) => setEditTeamName(e.target.value)}
                                                        className="mb-4 p-3 border rounded w-full"
                                                        placeholder="Team Name"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={editLocation}
                                                        onChange={(e) => setEditLocation(e.target.value)}
                                                        className="mb-4 p-3 border rounded w-full"
                                                        placeholder="Location"
                                                    />
                                                    <button
                                                        onClick={handleEditTeam}
                                                        className="p-3 bg-green-600 text-white rounded w-full hover:bg-green-700"
                                                    >
                                                        Save Changes
                                                    </button>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold mb-4">Add Players</h3>
                                                    <select
                                                        onChange={(e) =>
                                                            handleAddPlayer(team.id, Number(e.target.value))
                                                        }
                                                        className="mb-4 p-3 border rounded w-full"
                                                    >
                                                        <option value="">Select Player</option>
                                                        {players.map((player) => (
                                                            <option key={player.id} value={player.id}>
                                                                {player.user.username}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <h3 className="text-lg font-semibold mb-4">Players in Team</h3>
                                                    {team.players.length > 0 ? (
                                                        <table className="w-full border">
                                                            <thead>
                                                                <tr className="bg-gray-200 text-left text-sm text-gray-600 uppercase">
                                                                    <th className="py-3 px-4">Player Name</th>
                                                                    <th className="py-3 px-4">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {team.players.map((player) => (
                                                                    <tr key={player.id}>
                                                                        <td className="py-3 px-4">{player.user.username}</td>
                                                                        <td className="py-3 px-4">
                                                                            <button
                                                                                className="text-red-600 hover:underline"
                                                                                onClick={() =>
                                                                                    handlePlayerDelete(
                                                                                        team.id,
                                                                                        player.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p className="text-gray-500">No players in this team.</p>
                                                    )}
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
