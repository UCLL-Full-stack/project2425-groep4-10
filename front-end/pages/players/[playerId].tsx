import React from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import PlayerService from '@/services/PlayerService';
import { Player } from '@/types';
import Header from '@/components/header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import TeamService from '@/services/TeamService';

const fetcher = async (playerId: string) => {
    const player = await PlayerService.getPlayerById(Number(playerId));
    const teams = await TeamService.getAllTeams();
    const playerTeams = teams.filter(team => team.players.some(p => p.id === player.id));
    return { ...player, teams: playerTeams };
};

const PlayerDetailPage: React.FC = () => {
    const router = useRouter();
    const { playerId } = router.query;

    const { data: player, error } = useSWR(playerId ? `player-${playerId}` : null, () => fetcher(playerId as string));

    if (error) {
        return <p>Error loading player data.</p>;
    }

    if (!player) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Head>
                <title>{player.user.firstName} {player.user.lastName}</title>
            </Head>
            <Header />
            <main className="p-6 min-h-screen flex flex-col items-center">
                <h1>{player.user.firstName} {player.user.lastName}</h1>
                <section>
                    <table>
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td>{player.user.firstName} {player.user.lastName}</td>
                            </tr>
                            <tr>
                                <th>Position</th>
                                <td>{player.position}</td>
                            </tr>
                            <tr>
                                <th>Age</th>
                                <td>{player.age}</td>
                            </tr>
                            <tr>
                                <th>Teams</th>
                                <td>
                                    {Array.isArray(player.teams) && player.teams.length > 0 ? player.teams.map(team => team.teamName).join(', ') : 'No Team'}
                                </td>
                            </tr>
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

export default PlayerDetailPage;