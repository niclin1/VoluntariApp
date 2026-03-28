import React, { useEffect, useState } from 'react';
import { Voluntario } from '../models/types';
import { voluntario as initialVoluntario } from '../data';
import { Divider } from '../components/UI';

const categoryBg: Record<string, string> = {
    Educação: 'var(--tag-edu-bg)',
    Social: 'var(--tag-soc-bg)',
    'Meio Ambiente': 'var(--tag-env-bg)',
    Saúde: 'var(--tag-hlt-bg)',
};

export default function ProfilePage() {
    const [voluntario, setVoluntario] = useState<Voluntario>(initialVoluntario);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // async function loadVoluntario() {
        //     try {
        //         const res = await fetch('/api/v1/usuario');
        //         if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        //         const data: Voluntario = await res.json();
        //         console.log('Loaded voluntario:', data);
        //         setVoluntario(data[0]);
        //     } catch (err) {
        //         console.error('Failed to load voluntario:', err);
        //         setError('Não foi possível carregar os dados do perfil.');
        //     } finally {
        //         setLoading(false);
        //     }
        // }

        // loadVoluntario();
    }, []);

    // if (loading) {
    //     return (
    //         <div className="page page--cream">
    //             <div className="container container--mid">
    //                 <div className="heading-serif" style={{ fontSize: 22 }}>
    //                     Carregando perfil...
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    if (error) {
        return (
            <div className="page page--cream">
                <div className="container container--mid">
                    <div className="heading-serif" style={{ fontSize: 22 }}>
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page page--cream">
            <div className="container container--mid profile-grid">

                {/* ── Profile Card ── */}
                <div className="profile-card">
                    <div className="profile-card__avatar">{voluntario.initials}</div>

                    <div className="heading-serif mb-6" style={{ fontSize: 22, color: 'white' }}>
                        {voluntario.name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 14, marginBottom: 16 }}>
                        📍 {voluntario.city}, {voluntario.state}
                    </div>
                    <div className="profile-card-mini__badge mb-24">
                        Voluntária desde {voluntario.memberSince}
                    </div>

                    <Divider style={{ background: 'rgba(255,255,255,.1)', marginBottom: 16 }} />

                    {[
                        { label: 'Área de interesse', value: voluntario.interestArea },
                        { label: 'Disponibilidade', value: voluntario.availability },
                        { label: 'Modalidade', value: voluntario.modality },
                    ].map(info => (
                        <div key={info.label} className="profile-info-row">
                            <span className="profile-info-row__label">{info.label}</span>
                            <span className="profile-info-row__value">{info.value}</span>
                        </div>
                    ))}

                    <div className="profile-hours-box">
                        <div className="profile-hours-box__number">{voluntario.totalHours}h</div>
                        <div className="profile-hours-box__label">Total de horas voluntariadas</div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div>
                    <h2 className="heading-serif mb-20" style={{ fontSize: 22 }}>
                        Histórico de voluntariado
                    </h2>

                    {(voluntario.historico || []).map(h => (
                        <div key={h.id} className="card card--clickable profile-history-item mb-14" style={{ padding: '20px 24px' }}>
                            <div
                                className="profile-history-icon"
                                style={{ background: categoryBg[h.category] || 'var(--tag-edu-bg)' }}
                            >
                                {h.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div className="heading-serif mb-4" style={{ fontSize: 17 }}>
                                    {h.title}
                                </div>
                                <div className="text-muted" style={{ fontSize: 13 }}>
                                    {h.ong} · {h.period}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="text-green" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>
                                    {h.hours}h
                                </div>
                                <div className="text-muted" style={{ fontSize: 11, marginTop: 2 }}>horas</div>
                            </div>
                        </div>
                    ))}

                    {/* Stats summary */}
                    <div className="card" style={{ padding: 24, marginTop: 8 }}>
                        <div className="label-upper mb-20">Resumo</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                            {[
                                { num: voluntario.historico?.length, label: 'Atividades' },
                                { num: voluntario.totalHours, label: 'Horas totais' },
                                { num: new Set(voluntario.historico?.map(h => h.ong)).size, label: 'ONGs' },
                            ].map(s => (
                                <div key={s.label} className="stat-box">
                                    <div className="stat-box__number" style={{ fontSize: 32 }}>
                                        {s.num}{s.label === 'Horas totais' ? 'h' : ''}
                                    </div>
                                    <div className="stat-box__label" style={{ marginTop: 6 }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
