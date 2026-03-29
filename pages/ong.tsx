import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../context/AppContext';
import { ong } from '../data';
import { VagaStatus } from '../models/types';
import { StatusBadge, ProgressBar } from '../components/UI';
import { Navbar } from '../components/Navbar';
import { Spin, message } from 'antd';

export default function ONGPage() {
    const router = useRouter();
    const { setSelectedVaga, currentUserRole } = useApp();
    const [activeTab, setActiveTab] = useState<VagaStatus | 'Todas'>('Todas');
    const [ongData, setOngData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOng = async () => {
            try {
                const response = await fetch('/api/v1/ong');
                const data = await response.json();
                
                if (response.ok && data.length > 0) {
                    setOngData(data[0]); // getting the latest registered ONG for showcase 
                } else if (data.length === 0) {
                    message.info('Cadastre uma ONG primeiro.');
                    router.push('/Register');
                } else {
                    message.error('Erro ao buscar perfil da ONG');
                }
            } catch (error) {
                message.error('Erro ao conectar com o banco de dados');
            } finally {
                setLoading(false);
            }
        };

        fetchOng();
    }, [router]);

    const filtered = activeTab === 'Todas'
        ? ong.vagas
        : ong.vagas.filter(v => v.status === activeTab);

    if (loading) return <div className="flex justify-center items-center" style={{ height: '100vh' }}><Spin size="large" /></div>;
    if (!ongData) return null;

    const isOwnerOrAdmin = currentUserRole === 'ong' || currentUserRole === 'admin';

    return (
        <div className="page page--cream">
            <Navbar />
            <div className="container container--wide">

                {/* Header */}
                <div className="card--hero mb-28 flex items-center justify-between" style={{ borderRadius: 'var(--radius)', padding: 32 }}>
                    <div>
                        <h1 className="heading-serif mb-4" style={{ fontSize: 28, color: 'white' }}>
                            {ongData.nome}
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 14 }}>
                            📍 {ongData.localidade} · {ongData.email} · {ongData.telefone}
                        </p>
                    </div>
                    <div className="flex gap-20">
                        {[{ num: ong.activeVagas, label: 'Vagas ativas' }, { num: ong.totalVolunteers, label: 'Voluntários' }].map(s => (
                            <div key={s.label} className="ong-header-stat">
                                <div className="ong-header-stat__number">{s.num}</div>
                                <div className="ong-header-stat__label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex justify-between items-center mb-20">
                    <div className="tab-bar">
                        {(['Todas', 'Ativa', 'Pausada', 'Rascunho'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`tab-bar__btn${activeTab === tab ? ' tab-bar__btn--active' : ''}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    {isOwnerOrAdmin && (
                        <button
                            onClick={() => router.push('/form')}
                            className="btn btn--primary btn--sm"
                        >
                            + Nova Vaga
                        </button>
                    )}
                </div>

                {/* Vaga rows */}
                {filtered.map(vaga => (
                    <div key={vaga.id} className="ong-row">
                        <div className="ong-row__icon">{vaga.icon}</div>
                        <StatusBadge status={vaga.status} />
                        <div style={{ flex: 1 }}>
                            <div className="heading-serif mb-4" style={{ fontSize: 17 }}>
                                {vaga.title}
                            </div>
                            <div className="ong-row__info">
                                <span>📅 {vaga.availability}</span>
                                <span>⏱ {vaga.hoursPerWeek}/semana</span>
                                <span>📍 {vaga.modality}</span>
                            </div>
                        </div>

                        <ProgressBar value={vaga.filledSlots} max={vaga.totalSlots} />

                        <div className="flex gap-8 flex-shrink-0">
                            {isOwnerOrAdmin && <button className="btn btn--outline btn--sm">Editar</button>}
                            <button
                                onClick={() => { setSelectedVaga(vaga); router.push(`/vaga?id=${vaga.id}`); }}
                                className="btn btn--primary btn--sm"
                            >
                                {vaga.status === 'Rascunho' ? 'Publicar' : 'Ver'}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add button */}
                {isOwnerOrAdmin && (
                    <button onClick={() => router.push('/form')} className="btn--dashed">
                        + Criar nova vaga
                    </button>
                )}
            </div>
        </div>
    );
}
