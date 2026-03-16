import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../context/AppContext';
import { ong } from '../data';
import { VagaStatus } from '../models/types';
import { StatusBadge, ProgressBar } from '../components/UI';

export default function ONGPage() {
    const router = useRouter();
    const { setSelectedVaga } = useApp();
    const [activeTab, setActiveTab] = useState<VagaStatus | 'Todas'>('Todas');

    const filtered = activeTab === 'Todas'
        ? ong.vagas
        : ong.vagas.filter(v => v.status === activeTab);

    return (
        <div className="page page--cream">
            <div className="container container--wide">

                {/* Header */}
                <div className="card--hero mb-28 flex items-center justify-between" style={{ borderRadius: 'var(--radius)', padding: 32 }}>
                    <div>
                        <h1 className="heading-serif mb-4" style={{ fontSize: 28, color: 'white' }}>
                            {ong.name}
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 14 }}>
                            📍 {ong.city}, {ong.state} · desde {ong.since}
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
                    <button
                        onClick={() => router.push('/form')}
                        className="btn btn--primary btn--sm"
                    >
                        + Nova Vaga
                    </button>
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
                            <button className="btn btn--outline btn--sm">Editar</button>
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
                <button onClick={() => router.push('/form')} className="btn--dashed">
                    + Criar nova vaga
                </button>
            </div>
        </div>
    );
}
