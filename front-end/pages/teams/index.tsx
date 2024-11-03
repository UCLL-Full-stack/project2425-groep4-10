import React from 'react';
import { Team } from '@/types';
import Header from '../../components/header';
import TeamOverview from '@/components/teams/TeamOverview';
import teamService from '@/services/TeamService';
import { useState, useEffect } from 'react';

const TeamsPage: React.FC = () => {
    const [teams, setTeams] = useState<Array<Team>>([]);

    const getTeams = async () => {
        const response = await teamService.getAllTeams();
        const teamData = await response.json();
        setTeams(teamData);
    };

    const removePlayer = async (teamId: number, playerId: number) => {
        const result = await teamService.removePlayerFromTeam(teamId, playerId);
        if (result) {
            getTeams();
        }
    };

    useEffect(() => {
        getTeams();
    }, []);

    return (
        <>
            <Header />
            <h1>Team Overview</h1>
            <TeamOverview teams={teams} onRemovePlayer={removePlayer} />
        </>
    );
};

export default TeamsPage;
