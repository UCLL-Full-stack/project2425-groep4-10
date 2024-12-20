import React, { useState, useEffect } from 'react';
import { Team } from '@/types';
import TeamOverview from '@/components/teams/TeamOverview';
import teamService from '@/services/TeamService';
import { useTranslation } from 'next-i18next';
import Header from '@/components/header';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const TeamsPage: React.FC = () => {
    const [teams, setTeams] = useState<Array<Team>>([]);
    const [loggedInUser, setLoggedInUser] = useState<{ role: string } | null>(null);  // Initialize as null
    const { t } = useTranslation();

    useEffect(() => {
        // Get user from sessionStorage
        const user = JSON.parse(sessionStorage.getItem('user') || 'null');
        setLoggedInUser(user);  // Set loggedInUser to null if no user in session
    }, []);

    const getTeams = async () => {
        try {
            const teamsData = await teamService.getAllTeams();
            setTeams(teamsData);
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    useEffect(() => {
        getTeams();
    }, []);

    const handleRemovePlayer = async (teamId: number, playerId: number) => {
        try {
            await teamService.removePlayerFromTeam(teamId, playerId);
            getTeams();
        } catch (error) {
            console.error('Error removing player from team:', error);
        }
    };

    const handleAddTeam = async (teamName: string, location: string, coach: { id: number }, players: Array<{ id: number }>) => {
        try {
            await teamService.addTeam({ teamName, location, coach, players });
            getTeams();
        } catch (error) {
            console.error('Error adding team:', error);
        }
    };

    const handleEditTeam = async (teamId: number, teamName: string, location: string) => {
        try {
            await teamService.updateTeam({ id: teamId, teamName, location });
            getTeams();
        } catch (error) {
            console.error('Error editing team:', error);
        }
    };

    const handleAddPlayer = async (teamId: number, playerId: number) => {
        try {
            await teamService.addPlayerToTeam(teamId, playerId);
            getTeams();
        } catch (error) {
            console.error('Error adding player to team:', error);
        }
    };

    return (
        <div>
            <Header />
            <h1>Teams</h1>

            {/* Only render TeamOverview if the user is logged in */}
            {loggedInUser ? (
                <TeamOverview
                    teams={teams}
                    onRemovePlayer={handleRemovePlayer}
                    onAddTeam={handleAddTeam}
                    onEditTeam={handleEditTeam}
                    onAddPlayer={handleAddPlayer}
                    loggedInUser={loggedInUser}
                />
            ) : (
                <div className="p-8 bg-gray-100 text-center">
                    <h2 className="text-2xl font-semibold">Please log in to view teams</h2>
                </div>
            )}
        </div>
    );
};

export const getServerSideProps = async (context) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    }
}

export default TeamsPage;
