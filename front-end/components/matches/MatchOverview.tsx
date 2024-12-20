import React, { useState, useEffect } from "react";
import { Match, Team } from "@/types";
import matchService from "@/services/MatchService";
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
                console.error('Error fetching teams:', error);
            }
        };

        fetchTeams();
    }, []);

    useEffect(() => {
        let filtered = matches;

        if (filterDate) {
            filtered = filtered.filter(match => new Date(match.dateTime).toISOString().startsWith(filterDate));
        }

        if (filterTeamIds.length > 0) {
            filtered = filtered.filter(match =>
                match.teams.some(team => filterTeamIds.includes(team.id))
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
            alert("Please select two teams, date and location.");
        }
    };

    const handleTeamSelection = (teamId: number) => {
        setSelectedTeamIds(prevSelectedTeamIds =>
            prevSelectedTeamIds.includes(teamId)
                ? prevSelectedTeamIds.filter(id => id !== teamId)
                : [...prevSelectedTeamIds, teamId].slice(0, 2)
        );
    };

    const handleFilterTeamSelection = (teamId: number) => {
        setFilterTeamIds(prevFilterTeamIds =>
            prevFilterTeamIds.includes(teamId)
                ? prevFilterTeamIds.filter(id => id !== teamId)
                : [...prevFilterTeamIds, teamId]
        );
    };

    const handleClearFilter = () => {
        setFilterDate("");
        setFilterTeamIds([]);
    };

    if (!loggedInUser) {
        return <p className="text-gray-500">Log in to view this page.</p>;
    }

    return (
        <div className="p-4 bg-gray-100">
            {loggedInUser.role === "admin" && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold mb-4">Add New Match</h2>
                    <div className="mb-4">
                        <label className="block mb-2">Select Teams (2)</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableTeams.map(team => (
                                <button
                                    key={team.id}
                                    onClick={() => handleTeamSelection(team.id)}
                                    className={`p-2 border rounded ${selectedTeamIds.includes(team.id) ? "bg-blue-500 text-white" : "bg-white text-black"}`}
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
                            className="p-2 border rounded w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="p-2 border rounded w-full"
                        />
                    </div>
                    <button
                        onClick={handleAddMatch}
                        className="p-2 bg-green-500 text-white rounded w-full"
                    >
                        Add Match
                    </button>
                </div>
            )}

            <h2 className="text-lg font-bold mb-4">Matches</h2>
            <div className="mb-4">
                <label className="block mb-2">Filter by Date</label>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Filter by Teams</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableTeams.map(team => (
                        <button
                            key={team.id}
                            onClick={() => handleFilterTeamSelection(team.id)}
                            className={`p-2 border rounded ${filterTeamIds.includes(team.id) ? "bg-blue-500 text-white" : "bg-white text-black"}`}
                        >
                            {team.teamName}
                        </button>
                    ))}
                </div>
            </div>
            <button
                onClick={handleClearFilter}
                className="mt-2 p-2 bg-red-500 text-white rounded"
            >
                Clear Filter
            </button>
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
                        {filteredMatches.map(match => (
                            <tr key={match.id} className="border-b">
                                <td className="py-2 px-4">
                                    {match.teams.map(team => team.teamName).join(" vs ")}
                                </td>
                                <td className="py-2 px-4">{new Date(match.dateTime).toLocaleString()}</td>
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