import React, { useState, useEffect } from 'react';
import MatchOverview from '@/components/matches/MatchOverview';
import matchService from '@/services/MatchService';
import { Match } from '@/types';
import Header from '@/components/header';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const MatchesPage: React.FC = () => {
    const [matches, setMatches] = useState<Array<Match>>([]);
    const [loggedInUser, setLoggedInUser] = useState<{ role: string }>({ role: '' });

    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        setLoggedInUser(user);
    }, []);

    const getMatches = async () => {
        try {
            const matchesData = await matchService.getAllMatches();
            setMatches(matchesData);
        } catch (error) {
            console.error('Error fetching matches:', error);
        }
    };

    useEffect(() => {
        getMatches();
    }, []);

    const handleAddMatch = async (teamIds: number[], dateTime: string, location: string) => {
        try {
            const payload = { teamIds, dateTime, location };
            console.log("Payload being sent:", payload);
            await matchService.createMatch(payload);
            getMatches();
        } catch (error) {
            console.error('Error adding match:', error);
        }
    };

    return (
        <div>
            <Header />
            <h1 className="text-2xl font-bold mb-4">Matches</h1>
            <MatchOverview
                matches={matches}
                onAddMatch={handleAddMatch}
                loggedInUser={loggedInUser}
            />
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

export default MatchesPage;