import { Link } from 'react-router-dom';
import styles from './index.module.scss';

export default function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.linkbox}>
                <Link to="/springs">Springs</Link>
            </div>
        </div>
    );
}
