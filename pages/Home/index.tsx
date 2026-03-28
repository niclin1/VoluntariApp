import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Category } from '../../models/types';
import { vagas, voluntario } from '../../data';
import { VagaCard } from '../../components/VagaCard';
import { SectionHeader, Avatar } from '../../components/UI';
import { Navbar } from '../../components/Navbar';
import { Button } from 'antd';
import { ProfileMini } from '../../components/UI';
import styles from './style.module.css';

const categories: (Category | 'Todas')[] = ['Todas', 'Educação', 'Saúde', 'Social', 'Meio Ambiente'];
const catDots: Record<string, string> = {
    Todas: 'var(--green-700)',
    Educação: 'var(--green-500)',
    Saúde: '#e07a5f',
    Social: '#f2cc8f',
    'Meio Ambiente': '#81b29a',
};

export default function HomePage() {
    const [activeCategory, setActiveCategory] = useState<Category | 'Todas'>('Todas');
    const [activeFilter, setActiveFilter] = useState<string>('Todas');

    const filtered = activeCategory === 'Todas'
        ? vagas
        : vagas.filter(v => v.category === activeCategory);

    return (
        <>
            <Navbar />
            <div className="page page--cream">
                <div className={`container ${styles.home_grid}`}>

                    {/* ── Main ── */}
                    <main>
                        {/* Hero */}
                        <div className="card--hero mb-28" style={{ borderRadius: 'var(--radius)' }}>
                            <div className="hero-bg-emoji">🌿</div>
                            <div className="hero-location">
                                📍 {voluntario.city}, {voluntario.state} · atualizadas hoje
                            </div>
                            <div className="heading-serif" style={{ fontSize: 22, margin: '16px 0 8px' }}>
                                Vagas perto de você
                            </div>
                            <div className="hero-count">{filtered.length}</div>
                            <div className="hero-label">oportunidades disponíveis</div>
                        </div>

                        {/* Filter pills */}
                        <SectionHeader title="Em destaque" action="Ver todas" />
                        <div className={styles.filter_pills}>
                            {['Todas', 'Educação', 'Saúde', 'Meio Amb.', 'Fins de semana', 'Presencial'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`${styles.filter_pill} ${activeFilter === f ? styles.filter_pill_active : ''}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Cards */}
                        {filtered.map(v => <VagaCard key={v.id} vaga={v} />)}
                    </main>

                    {/* ── Sidebar Right ── */}
                    <aside className={styles.sidebar}>

                        {/* Profile card */}
                        <ProfileMini voluntario={voluntario} />
                        {/* Stats */}
                        <div className="card" style={{ padding: 22 }}>
                            <div className="label-upper mb-16">Minhas horas</div>
                            <div className="flex gap-12">
                                {[{ num: voluntario.totalHours, label: 'Total horas' }, { num: voluntario.historico.length, label: 'Atividades' }].map(s => (
                                    <div key={s.label} className="stat-box" style={{ flex: 1 }}>
                                        <div className="stat-box__number">{s.num}</div>
                                        <div className="stat-box__label">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* History */}
                        <div className="card" style={{ padding: 22 }}>
                            <div className="label-upper mb-16">Histórico recente</div>
                            {voluntario.historico.map((h, i) => (
                                <div
                                    key={h.id}
                                    className="history-item"
                                    style={{ borderBottom: i < voluntario.historico.length - 1 ? '1px solid var(--gray-200)' : 'none' }}
                                >
                                    <div
                                        className="history-icon"
                                        style={{
                                            background: h.category === 'Educação' ? 'var(--tag-edu-bg)' : h.category === 'Social' ? 'var(--tag-soc-bg)' : 'var(--tag-env-bg)',
                                        }}
                                    >
                                        {h.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div className="history-title">{h.title}</div>
                                        <div className="history-meta">{h.ong} · {h.period}</div>
                                    </div>
                                    <div className="history-hours">{h.hours}h</div>
                                </div>
                            ))}
                            <Link href="/profile" style={{ display: 'block', marginTop: '16px' }}>
                                <Button type="default" block style={{ borderColor: 'var(--green-300)', color: 'var(--green-700)' }}>
                                    Ver perfil completo →
                                </Button>
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
