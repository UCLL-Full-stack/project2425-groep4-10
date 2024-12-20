import React, { useState, useEffect } from "react";
import { Match, Team } from "@/types";
import teamService from "@/services/TeamService";

type Props = {
    matches: Array<Match>;
    onAddMatch: (teamIds: number[], dateTime: string, location: string) => void;
    loggedInUser: { role: string } | null;
};

const MatchOverview: React.FC<Props> = ({ matches, onAddMatch, loggedInUser }) => {
    const [availableTeams, setAvailableTeams] = useState<Array<Team>>([]);
    const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
    const [dateTime, setDateTime] = useState("");
    const [location, setLocation] = useState("");
    const [filterDate, setFilterDate] = useState<string>("");
    const [filterTeamIds, setFilterTeamIds] = useState<number[]>([]);
    const [filteredMatches, setFilteredMatches] = useState<Array<Match>>(matches);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const teamsData = await teamService.getAllTeams();
                setAvailableTeams(teamsData);
            } catch (error) {
                console.error("Error fetching teams:", error);
            }
        };

        fetchTeams();
    }, []);

    useEffect(() => {
        let filtered = matches;

        if (filterDate) {
            filtered = filtered.filter((match) =>
                new Date(match.dateTime).toISOString().startsWith(filterDate)
            );
        }

        if (filterTeamIds.length > 0) {
            filtered = filtered.filter((match) =>
                match.teams.some((team) => filterTeamIds.includes(team.id))
            );
        }

        setFilteredMatches(filtered);
    }, [filterDate, filterTeamIds, matches]);

    const handleAddMatch = () => {
        if (selectedTeamIds.length === 2 && dateTime && location) {
            onAddMatch(selectedTeamIds, dateTime, location);
            setSelectedTeamIds([]);
            setDateTime("");
            setLocation("");
        } else {
            alert("Please select two teams, date, and location.");
        }
    };

    const handleTeamSelection = (teamId: number) => {
        setSelectedTeamIds((prevSelectedTeamIds) =>
            prevSelectedTeamIds.includes(teamId)
                ? prevSelectedTeamIds.filter((id) => id !== teamId)
                : [...prevSelectedTeamIds, teamId].slice(0, 2)
        );
    };

    const handleFilterTeamSelection = (teamId: number) => {
        setFilterTeamIds((prevFilterTeamIds) =>
            prevFilterTeamIds.includes(teamId)
                ? prevFilterTeamIds.filter((id) => id !== teamId)
                : [...prevFilterTeamIds, teamId]
        );
    };

    const handleClearFilter = () => {
        setFilterDate("");
        setFilterTeamIds([]);
    };

    if (!loggedInUser) {
        return (
            <div className="p-8 bg-gray-100 text-center">
                <h2 className="text-2xl font-semibold">Log in to view page</h2>
            </div>
        );
    }

    return (
        <div className="p-8 bg-gray-100">
            {loggedInUser && loggedInUser.role === "admin" && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Add New Match</h2>
                    <div className="mb-4">
                        <label className="block mb-2">Select Teams (2)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableTeams.map((team) => (
                                <button
                                    key={team.id}
                                    onClick={() => handleTeamSelection(team.id)}
                                    className={`p-3 border rounded-lg transition-all duration-300 ${selectedTeamIds.includes(team.id)
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-800 hover:bg-gray-200"
                                        }`}
                                >
                                    {team.teamName}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Date and Time</label>
                        <input
                            type="datetime-local"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                            className="p-3 border rounded-lg w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="p-3 border rounded-lg w-full"
                        />
                    </div>
                    <button
                        onClick={handleAddMatch}
                        className="p-3 bg-green-500 text-white rounded-lg w-full"
                    >
                        Add Match
                    </button>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Filter Matches</h2>
                <div className="mb-4">
                    <label className="block mb-2">Filter by Date</label>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className="p-3 border rounded-lg w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Filter by Teams</label>
                    <div className="flex flex-wrap gap-4">
                        {availableTeams.map((team) => (
                            <label key={team.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={filterTeamIds.includes(team.id)}
                                    onChange={() => handleFilterTeamSelection(team.id)}
                                    className="h-5 w-5"
                                />
                                <span className="text-gray-700">{team.teamName}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleClearFilter}
                    className="p-3 bg-red-500 text-white rounded-lg w-full"
                >
                    Clear Filter
                </button>
            </div>

            <h2 className="text-xl font-semibold mb-4">Matches</h2>
            {filteredMatches.length > 0 ? (
                <table className="w-full bg-white border">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                        <tr>
                            <th className="py-2 px-4 text-left">Teams</th>
                            <th className="py-2 px-4 text-left">Date and Time</th>
                            <th className="py-2 px-4 text-left">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMatches.map((match) => (
                            <tr key={match.id} className="border-b">
                                <td className="py-2 px-4">
                                    {match.teams.map((team) => team.teamName).join(" vs ")}
                                </td>
                                <td className="py-2 px-4">
                                    {new Date(match.dateTime).toLocaleString()}
                                </td>
                                <td className="py-2 px-4">{match.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">No current matches.</p>
            )}
        </div>
    );
};

export default MatchOverview;
