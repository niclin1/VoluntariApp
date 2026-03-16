import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Category } from '../models/types';
import { vagas, voluntario } from '../data';
import { VagaCard } from '../components/VagaCard';
import { SectionHeader, Avatar } from '../components/UI';

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
        <div className="page page--cream">
            <div className="container home-grid">

                {/* ── Sidebar Left ── */}
                <aside className="sidebar">
                    {/* Profile card */}
                    <div className="profile-card-mini">
                        <Avatar initials={voluntario.initials} size={64} />
                        <div style={{ height: 12 }} />
                        <div className="profile-card-mini__name">
                            {voluntario.name.split(' ').slice(0, 2).join(' ')}
                        </div>
                        <div className="profile-card-mini__location">
                            📍 {voluntario.city}, {voluntario.state}
                        </div>
                        <div className="profile-card-mini__badge">
                            Voluntária desde {voluntario.memberSince}
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="card" style={{ padding: 20 }}>
                        <div className="label-upper mb-14">Categorias</div>
                        {categories.map(cat => (
                            <div
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`category-item${activeCategory === cat ? ' category-item--active' : ''}`}
                            >
                                <span className="category-dot" style={{ background: catDots[cat] }} />
                                {cat}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ── Main ── */}
                <main>
                    {/* Hero */}
                    <div className="card--hero mb-28" style={{ borderRadius: 'var(--radius)' }}>
                        <div className="hero-bg-emoji">🌿</div>
                        <div className="hero-location">
                            📍 {voluntario.city}, {voluntario.state} · atualizadas hoje
                        </div>
                        <div className="heading-serif" style={{ fontSize: 22, marginBottom: 4 }}>
                            Vagas perto de você
                        </div>
                        <div className="hero-count">{filtered.length}</div>
                        <div className="hero-label">oportunidades disponíveis</div>
                    </div>

                    {/* Filter pills */}
                    <SectionHeader title="Em destaque" action="Ver todas" />
                    <div className="filter-pills">
                        {['Todas', 'Educação', 'Saúde', 'Meio Amb.', 'Fins de semana', 'Presencial'].map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`filter-pill${activeFilter === f ? ' filter-pill--active' : ''}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Cards */}
                    {filtered.map(v => <VagaCard key={v.id} vaga={v} />)}
                </main>

                {/* ── Sidebar Right ── */}
                <aside className="sidebar">
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
                        <Link href="/profile">
                            <button className="btn btn--outline btn--full mt-14" style={{ fontSize: 13 }}>
                                Ver perfil completo →
                            </button>
                        </Link>
                    </div>
                </aside>
            </div>
        </div>
    );
}
