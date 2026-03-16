import React from 'react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';

export default function WelcomePage() {
    const { setUserType } = useApp();

    return (
        <div className="welcome">
            <div className="welcome__inner">
                <div className="welcome__emoji">🌿</div>

                <h1 className="welcome__title">
                    Transforme seu{' '}
                    <span className="welcome__highlight">tempo em impacto</span>
                </h1>

                <p className="welcome__subtitle">
                    Conectamos voluntários a ONGs que precisam de você. Juntos construímos um futuro melhor.
                </p>

                <Link href="/home" onClick={() => setUserType('volunteer')}>
                    <button className="btn--welcome-primary">
                        Quero ser voluntário →
                    </button>
                </Link>

                <Link href="/ong" onClick={() => setUserType('ong')}>
                    <button className="btn--welcome-secondary">
                        Sou uma ONG
                    </button>
                </Link>
            </div>
        </div>
    );
}
