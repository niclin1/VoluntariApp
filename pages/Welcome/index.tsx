import React from 'react';
import Link from 'next/link';
import { Button, Typography } from 'antd';
import { useApp } from '../../context/AppContext';
import styles from './index.module.css';

const { Title, Text } = Typography;

export default function WelcomePage() {
    const { setUserType } = useApp();

    return (
        <div className={styles.welcome}>
            <div className={styles.welcome_inner}>
                <div className={styles.welcome_emoji}>
                    <img
                        src="/icon-transparent.png"
                        alt="VoluntariApp Logo"
                        style={{ width: '5.2em', height: '5.2em', objectFit: 'contain' }}
                    />
                </div>

                <Title level={1} className={styles.welcome_title}>
                    Transforme seu{' '}
                    <span className={styles.welcome_highlight}>tempo em impacto</span>
                </Title>

                <Text className={styles.welcome_subtitle}>
                    Conectamos voluntários a ONGs que precisam de você.
                    Juntos construímos um futuro melhor.
                </Text>

                <div className={styles.welcome_actions}>
                    <Link href="/Register" onClick={() => setUserType('volunteer')}>
                        <Button type="primary" block size="large">
                            Quero me voluntariar →
                        </Button>
                    </Link>

                    <Link href="/Register" onClick={() => setUserType('ong')}>
                        <Button type="default" block size="large">
                            Sou uma ONG
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
