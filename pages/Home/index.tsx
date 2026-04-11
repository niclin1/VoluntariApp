import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Category, Vaga } from '../../models/types';
import { voluntario } from '../../data';
import { VagaCard } from '../../components/VagaCard';
import { SectionHeader, Avatar } from '../../components/UI';
import { Navbar } from '../../components/Navbar';
import { Button, Spin, message } from 'antd';
import { ProfileMini } from '../../components/UI';
import styles from './style.module.css';

import { useApp } from '../../context/AppContext';

const categories: (Category | 'Todas')[] = ['Todas', 'Educação', 'Saúde', 'Social', 'Meio Ambiente'];
const catDots: Record<string, string> = {
    Todas: 'var(--green-700)',
    Educação: 'var(--green-500)',
    Saúde: '#e07a5f',
    Social: '#f2cc8f',
    'Meio Ambiente': '#81b29a',
};

export default function HomePage() {
    const { currentUserRole, currentUser } = useApp();
    const [activeCategory, setActiveCategory] = useState<Category | 'Todas'>('Todas');
    const [activeFilter, setActiveFilter] = useState<string>('Todas');
    const [dbVagas, setDbVagas] = useState<Vaga[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVagas = async () => {
            try {
                const response = await fetch('/api/v1/trabalho');
                const data = await response.json();

                if (response.ok) {
                    // Mapeia os dados do Banco para o formato esperado pelo VagaCard
                    const mappedVagas: Vaga[] = data.map((t: any) => ({
                        id: t.id.toString(),
                        title: t.titulo,
                        ong: t.ong_nome || 'ONG Parceira',
                        city: t.ong_city || 'Remoto/Local', // Update city fallback
                        category: (t.categoria?.trim() as Category) || 'Social',
                        modality: 'Híbrido', // fallback since its not in db yet
                        availability: t.disponibilidade,
                        hoursPerWeek: t.carga_horaria.toString(),
                        totalSlots: t.n_vagas,
                        filledSlots: 0, // start at 0
                        startDate: new Date(t.criado_em).toLocaleDateString('pt-BR'),
                        description: t.descricao,
                        requirements: [],
                        icon: t.categoria === 'Educação' ? '📚' : t.categoria === 'Saúde' ? '💚' : t.categoria === 'Meio Ambiente' ? '🌱' : '🤝',
                        status: 'Ativa',
                        ongEmail: t.ong_email || '',
                        ongPhone: t.ong_phone || '',
                        ongSince: t.ong_since ? new Date(t.ong_since).getFullYear().toString() : '2023',
                    }));

                    setDbVagas(mappedVagas);
                } else {
                    message.error('Erro ao carregar vagas do banco.');
                }
            } catch (err) {
                console.error("Error fetching vagas:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVagas();
    }, []);

    // Normalize string removing accents/special characters for safer comparison
    const normalizeStr = (str: string | undefined) => 
        str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() || "";

    const filtered = activeCategory === 'Todas'
        ? dbVagas
        : dbVagas.filter(v => normalizeStr(v.category) === normalizeStr(activeCategory));

    if (loading) return <div className="flex justify-center items-center" style={{ height: '100vh' }}><Spin size="large" /></div>;

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
                                📍 Brasil · atualizadas hoje
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
                            {['Todas', 'Educação', 'Saúde', 'Meio Ambiente', 'Social'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setActiveCategory(f as any)}
                                    className={`${styles.filter_pill} ${activeCategory === f ? styles.filter_pill_active : ''}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        {/* Cards */}
                        {filtered.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-500)' }}>
                                Nenhuma vaga encontrada na base de dados conectada.
                            </div>
                        ) : (
                            filtered.map(v => <VagaCard key={v.id} vaga={v} />)
                        )}
                    </main>

                    {/* ── Sidebar Right ── */}
                    <aside className={styles.sidebar}>

                        {/* Stats */}
                        <div className="card" style={{ padding: 22 }}>
                            <div className="label-upper mb-16">Minhas horas</div>
                            <div className="flex gap-12">
                                {[{ num: 0, label: 'Total horas' }, { num: 0, label: 'Atividades' }].map(s => (
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
                            
                            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--gray-500)', fontSize: 13 }}>
                                Nenhuma atividade de voluntariado registrada recentemente.
                            </div>
                            
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
