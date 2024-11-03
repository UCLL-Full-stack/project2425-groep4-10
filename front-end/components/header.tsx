import Link from "next/link";
import styles from "../styles/Header.module.css";

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <a className={styles.title}>
                Football manager
            </a>
            <nav className={styles.nav}>
                <Link href="/" className={styles.navLink}>
                    Home
                </Link>
                <Link href="/teams" className={styles.navLink}>
                    Teams
                </Link>
                <Link href="/coaches" className={styles.navLink}>
                    Coaches
                </Link>
                <Link href="/players" className={styles.navLink}>
                    Players
                </Link>
            </nav>
        </header>
    );
}

export default Header;

