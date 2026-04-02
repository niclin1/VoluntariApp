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
    { href: '/Home', label: 'Home' },
    { href: '/vaga', label: 'Vaga' },
    { href: '/ong', label: 'ONG' },
    { href: '/profile', label: 'Perfil' },
];

export const Navbar = () => {
    const router = useRouter();
    const { userType, setUserType, currentUserRole, setCurrentUserRole } = useApp();
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <nav className={styles.navbar}>
                {/* Logo */}
                <Link href="/" className={styles.navbar__logo}>
                    <img
                        src="/icon-transparent.png"
                        alt="VoluntariApp Logo"
                        style={{ width: '3.2em', height: '3.2em', objectFit: 'contain' }}
                    />
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

                {/* Right Area - Role Simulator Desktop */}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                    <span style={{ fontSize: '12px', opacity: 0.8 }}>View as:</span>
                    <select
                        value={currentUserRole}
                        onChange={(e) => setCurrentUserRole(e.target.value as any)}
                        style={{ padding: '4px', borderRadius: '4px', background: 'var(--green-900)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        <option value="guest">Guest</option>
                        <option value="volunteer">Volunteer</option>
                        <option value="ong">ONG</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

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


                {/* Mobile Profile Link & Role Simulator */}
                <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                        <span style={{ fontSize: '14px', opacity: 0.8 }}>View as (Role):</span>
                        <select
                            value={currentUserRole}
                            onChange={(e) => setCurrentUserRole(e.target.value as any)}
                            style={{ flex: 1, padding: '8px', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                        >
                            <option value="guest" style={{ color: 'black' }}>Guest</option>
                            <option value="volunteer" style={{ color: 'black' }}>Volunteer</option>
                            <option value="ong" style={{ color: 'black' }}>ONG</option>
                            <option value="admin" style={{ color: 'black' }}>Admin</option>
                        </select>
                    </div>

                    <Link href="/profile" className={styles.mobile_drawer_profile} onClick={() => setDrawerOpen(false)}>
                        <Avatar initials={voluntario.initials} size={40} />
                        <div className={styles.mobile_drawer_profile_name}>{voluntario.name}</div>
                    </Link>
                </div>
            </Drawer>
        </>
    );
};
