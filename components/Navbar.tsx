import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../context/AppContext';
import { Avatar } from './UI';
import { voluntario } from '../data';

const navItems = [
  { href: '/', label: 'Boas-Vindas' },
  { href: '/home', label: 'Home' },
  { href: '/vaga', label: 'Vaga' },
  { href: '/ong', label: 'ONG' },
  { href: '/form', label: 'Nova Vaga' },
  { href: '/profile', label: 'Perfil' },
];

export const Navbar = () => {
  const router = useRouter();
  const { userType, setUserType } = useApp();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar__logo">
        <div className="navbar__logo-icon">🌱</div>
        <span className="navbar__logo-text">VoluntApp</span>
      </Link>

      <div className="navbar__tabs">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`navbar__tab${router.pathname === item.href ? ' navbar__tab--active' : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="navbar__right">
        <div className="navbar__toggle">
          {(['volunteer', 'ong'] as const).map(t => (
            <button
              key={t}
              onClick={() => setUserType(t)}
              className={`navbar__toggle-btn${userType === t ? ' navbar__toggle-btn--active' : ''}`}
            >
              {t === 'volunteer' ? 'Voluntário' : 'ONG'}
            </button>
          ))}
        </div>
        <Link href="/profile" style={{ cursor: 'pointer' }}>
          <Avatar initials={voluntario.initials} size={36} />
        </Link>
      </div>
    </nav>
  );
};
