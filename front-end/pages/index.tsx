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
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header></Header>
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