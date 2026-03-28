import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { Avatar } from './UI';
import { voluntario } from '../data';
import styles from './Navbar.module.css';

const navItems = [
    { href: '/', label: 'Boas-Vindas' },
    { href: '/Home', label: 'Home' },
    { href: '/Vaga', label: 'Vaga' },
    { href: '/Ong', label: 'ONG' },
    { href: '/Form', label: 'Nova Vaga' },
    { href: '/Profile', label: 'Perfil' },
];

export const Navbar = () => {
    const router = useRouter();
    const { userType, setUserType } = useApp();
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <nav className={styles.navbar}>
                {/* Logo */}
                <Link href="/" className={styles.navbar__logo}>
                    <div className={styles.navbar__logo_icon}>🌱</div>
                    <span className={styles.navbar__logo_text}>VoluntApp</span>
                </Link>

                {/* Tabs - Desktop Only */}
                <div className={styles.navbar__tabs}>
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navbar__tab} ${router.pathname === item.href ? styles.navbar__tab__active : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Right Area - Desktop Only */}
                {/* <div className={styles.navbar__right}>
                    <div className={styles.navbar__toggle}>
                        {(['volunteer', 'ong'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setUserType(t)}
                                className={`${styles.navbar__toggle_btn} ${userType === t ? styles.navbar__toggle_btn__active : ''}`}
                            >
                                {t === 'volunteer' ? 'Voluntário' : 'ONG'}
                            </button>
                        ))}
                    </div>
                    <Link href="/profile" style={{ cursor: 'pointer' }}>
                        <Avatar initials={voluntario.initials} size={36} />
                    </Link>
                </div> */}

                {/* Hamburger Button - Mobile Only */}
                <Button
                    icon={<MenuOutlined />}
                    className={styles.hamburger_btn}
                    size="large"
                    onClick={() => setDrawerOpen(true)}
                />
            </nav>

            <Drawer
                title="Menu"
                placement="right"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                rootClassName={styles.mobile_drawer}
                styles={{
                    header: { background: 'var(--green-900)', borderBottom: 'none' },
                    body: { background: 'var(--green-900)' }
                }}
            >
                <div className={styles.mobile_drawer_links}>
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.mobile_drawer_link} ${router.pathname === item.href ? styles.mobile_drawer_link_active : ''}`}
                            onClick={() => setDrawerOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>


                {/* Mobile Profile Link */}
                <Link href="/profile" className={styles.mobile_drawer_profile} onClick={() => setDrawerOpen(false)}>
                    <Avatar initials={voluntario.initials} size={40} />
                    <div className={styles.mobile_drawer_profile_name}>{voluntario.name}</div>
                </Link>
            </Drawer>
        </>
    );
};
