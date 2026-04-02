import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../context/AppContext';
import { vagas } from '../data';
import { CategoryTag, ModalityTag } from '../components/UI';
import { Navbar } from '../components/Navbar';

export default function VagaPage() {
    const router = useRouter();
    const { selectedVaga } = useApp();
    const vaga = selectedVaga ?? vagas[0];

    return (
        <>
            <Navbar />
            <div className="page page--cream">

                <div className="container container--mid vaga-detail-grid">

                    {/* ── Main ── */}
                    <div>
                        <button onClick={() => router.back()} className="btn--back">
                            ← Voltar
                        </button>

                        {/* Hero */}
                        <div className="card--hero mb-24" style={{ borderRadius: 'var(--radius)', padding: 32 }}>
                            <div className="flex items-center gap-10 mb-16">
                                <div style={{
                                    width: 40, height: 40, background: 'rgba(255,255,255,.15)',
                                    borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                                }}>
                                    {vaga.icon}
                                </div>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 600 }}>{vaga.ong}</div>
                                    <div style={{ fontSize: 12, color: 'var(--green-300)' }}>ONG verificada ✓</div>
                                </div>
                            </div>
                            <h1 className="heading-serif" style={{ fontSize: 34, lineHeight: 1.15, marginBottom: 16 }}>
                                {vaga.title}
                            </h1>
                            <div className="flex gap-8 flex-wrap">
                                <CategoryTag category={vaga.category} />
                                <ModalityTag modality={vaga.modality} />
                            </div>
                        </div>

                        {/* Info grid */}
                        <div className="info-grid">
                            {[
                                { label: 'Vagas Abertas', value: `${vaga.totalSlots - vaga.filledSlots} restantes` },
                                { label: 'Carga Horária', value: `${vaga.hoursPerWeek} / semana` },
                                { label: 'Período', value: vaga.availability },
                                { label: 'Início', value: vaga.startDate },
                            ].map(info => (
                                <div key={info.label} className="info-box">
                                    <div className="info-box__label">{info.label}</div>
                                    <div className="info-box__value">{info.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="mb-28">
                            <h3 className="heading-serif mb-12" style={{ fontSize: 18 }}>Sobre a vaga</h3>
                            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--gray-600)' }}>
                                {vaga.description}
                            </p>
                        </div>

                        {/* Requirements */}
                        {vaga.requirements.length > 0 && (
                            <div>
                                <h3 className="heading-serif mb-12" style={{ fontSize: 18 }}>Requisitos</h3>
                                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {vaga.requirements.map((req, i) => (
                                        <li key={i} className="flex items-center gap-10" style={{ fontSize: 15, color: 'var(--gray-600)' }}>
                                            <span style={{ color: 'var(--green-600)', fontWeight: 700 }}>✓</span>
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* ── Sticky Sidebar ── */}
                    <div className="vaga-sidebar">
                        <div className="card" style={{ padding: 28, boxShadow: 'var(--shadow-md)' }}>
                            <div className="heading-serif mb-6" style={{ fontSize: 20 }}>
                                Pronto para contribuir?
                            </div>
                            <div className="text-muted mb-24" style={{ fontSize: 13 }}>
                                {vaga.totalSlots - vaga.filledSlots} vagas disponíveis · Resposta em até 48h
                            </div>

                            <button className="btn btn--primary btn--full mb-12" style={{ padding: 16, fontSize: 15 }}>
                                Quero me voluntariar →
                            </button>

                            <button className="btn btn--outline btn--full" style={{ padding: 14, fontSize: 14, fontWeight: 600 }}>
                                💬 Enviar mensagem
                            </button>

                            <div className="flex gap-8 mt-16">
                                {['🔗 Compartilhar', '⭐ Salvar'].map(btn => (
                                    <button key={btn} className="btn btn--secondary" style={{
                                        flex: 1, padding: 10, borderRadius: 'var(--radius-sm)',
                                        fontSize: 12,
                                    }}>
                                        {btn}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ONG info */}
                        <div className="card" style={{ padding: 22 }}>
                            <div className="flex items-center gap-12 mb-12">
                                <div style={{
                                    width: 48, height: 48, background: 'var(--green-50)',
                                    borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                                }}>
                                    {vaga.icon}
                                </div>
                                <div>
                                    <div className="heading-serif" style={{ fontSize: 15 }}>{vaga.ong}</div>
                                    <div className="text-muted" style={{ fontSize: 12 }}>📍 {vaga.city}</div>
                                </div>
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6 }}>
                                Organização sem fins lucrativos dedicada à transformação social através da educação e do voluntariado.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>

    );
}
