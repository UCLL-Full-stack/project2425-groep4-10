import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PlayerService from '@/services/PlayerService';
import TeamService from '@/services/TeamService';
import { Player, Team } from '@/types';
import Header from '@/components/header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

const PlayersPage: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchPlayersAndTeams = async () => {
            try {
                const [playersData, teamsData] = await Promise.all([
                    PlayerService.getAllPlayers(),
                    TeamService.getAllTeams()
                ]);

                const playersWithTeams = playersData.map(player => {
                    const playerTeams = teamsData.filter(team => team.players.some(p => p.id === player.id));
                    return { ...player, teams: playerTeams };
                });

                setPlayers(playersWithTeams);
                setTeams(teamsData);
            } catch (error) {
                console.error('Error fetching players or teams:', error);
            }
        };

        fetchPlayersAndTeams();
    }, []);

    const handleRowClick = (playerId: number) => {
        router.push(`/players/${playerId}`);
    };

    return (
        <>
            <Head>
                <title>Players</title>
            </Head>
            <Header />
            <main className="p-6 min-h-screen flex flex-col items-center">
                <h1>Players</h1>
                <section>
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Team</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map(player => (
                                <tr key={player.id} onClick={() => handleRowClick(player.id)} style={{ cursor: 'pointer' }}>
                                    <td>{player.user.firstName + " " + player.user.lastName}</td>
                                    <td>
                                        {Array.isArray(player.teams) && player.teams.length > 0 ? player.teams.map(team => team.teamName).join(', ') : 'No Team'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </>
    );
};

export const getServerSideProps = async (context) => {
    const { locale } = context;

    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    };
};

export default PlayersPage;