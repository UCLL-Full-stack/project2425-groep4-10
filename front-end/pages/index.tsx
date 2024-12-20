import Head from "next/head";
import Header from "../components/header";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Home: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <Head>
                <title>{t('app.title')}</title>
                <meta name="description" content="Match app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <main className="p-6 min-h-screen flex flex-col items-center justify-center text-center bg-white">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-4">{t('home.title')}</h1>
                <p className="text-xl text-gray-700 mb-6">{t('home.description')}</p>
            </main>
        </>
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

export default Home;
