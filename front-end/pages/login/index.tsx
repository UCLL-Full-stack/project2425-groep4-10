import Head from "next/head";
import Header from "../../components/header";
import UserLoginForm from "../../components/users/UserLoginForm";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

const predefinedUsers = [
    { username: 'johanp', password: 'johanp123', role: 'coach' },
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'greetjej', password: 'greetjej123', role: 'player' }
];

const Login: React.FC = () => {
    const { t } = useTranslation();
    return (
        <>
            <Head>
                <title>{t("login.title")}</title>
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    <UserLoginForm />
                    <div className="mt-8">
                        <h2>{t('login.users')}</h2>
                        <table className="table-auto border-collapse border border-gray-400 mt-4">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Username</th>
                                    <th className="border border-gray-300 px-4 py-2">Password</th>
                                    <th className="border border-gray-300 px-4 py-2">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {predefinedUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td className="border border-gray-300 px-4 py-2">{user.username}</td>
                                        <td className="border border-gray-300 px-4 py-2">{user.password}</td>
                                        <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
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

export default Login;