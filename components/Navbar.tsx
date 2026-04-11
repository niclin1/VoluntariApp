import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Drawer, message } from 'antd';
import { MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { Avatar } from './UI';
import { voluntario } from '../data';
import styles from './Navbar.module.css';

const navItems = [
    { href: '/Home', label: 'Home' },
    { href: '/form', label: 'Criar Vaga' },
    { href: '/ong', label: 'Dashboard ONG' },
    { href: '/profile', label: 'Perfil' },
];

export const Navbar = () => {
    const router = useRouter();
    const { userType, setUserType, currentUserRole, setCurrentUserRole } = useApp();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await fetch('/api/v1/auth/logout', { method: 'POST' });
            setCurrentUserRole('guest');
            // reset specific states if necessary, or just force route
            message.success('Você saiu com sucesso, volte sempre!');
            router.push('/Login');
        } catch (error) {
            message.error('Erro ao encerrar sessão.');
        }
    };

    // Filter nav items based on user role
    const filteredNavItems = navItems.filter(item => {
        if (currentUserRole === 'ong' || currentUserRole === 'admin') {
            // ONGs should not see the Volunteer-specific "Perfil" page
            return item.href !== '/profile';
        } else {
            // Volunteers and guests should not see ONG-specific dashboards/forms forms
            return item.href !== '/ong' && item.href !== '/form';
        }
    });

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
                    {filteredNavItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navbar__tab} ${router.pathname === item.href ? styles.navbar__tab__active : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Sair / Logout Desktop */}
                    {currentUserRole !== 'guest' && (
                        <button 
                            className={`${styles.navbar__tab} ${styles.navbar__tab_logout} flex items-center gap-4`} 
                            onClick={handleLogout}
                            style={{ 
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: 'rgba(255,255,255,0.7)', marginLeft: '16px'
                            }}
                        >
                            <LogoutOutlined /> Sair
                        </button>
                    )}
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
                    {filteredNavItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.mobile_drawer_link} ${router.pathname === item.href ? styles.mobile_drawer_link_active : ''}`}
                            onClick={() => setDrawerOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Sair / Logout Mobile */}
                    {currentUserRole !== 'guest' && (
                        <button 
                            className={styles.mobile_drawer_link} 
                            onClick={() => {
                                setDrawerOpen(false);
                                handleLogout();
                            }}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'rgba(255,200,200,1)' }}
                        >
                            <LogoutOutlined /> Sair da conta
                        </button>
                    )}
                </div>


                {/* Mobile Profile Link */}
                {currentUserRole !== 'ong' && currentUserRole !== 'admin' && (
                    <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        <Link href="/profile" className={styles.mobile_drawer_profile} onClick={() => setDrawerOpen(false)}>
                            <Avatar initials={voluntario.initials} size={40} />
                            <div className={styles.mobile_drawer_profile_name}>{voluntario.name}</div>
                        </Link>
                    </div>
                )}
            </Drawer>
        </>
    );
};
