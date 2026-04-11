import React, { useEffect, useState } from 'react';
import { Voluntario } from '../models/types';
import { voluntario as initialVoluntario } from '../data';
import { Divider } from '../components/UI';
import { Navbar } from '../components/Navbar';
import { useRouter } from 'next/router';
import { Spin, message, Modal, Form, Input, Select } from 'antd';

import { useApp } from '../context/AppContext';

const { Option } = Select;

const categoryBg: Record<string, string> = {
    Educação: 'var(--tag-edu-bg)',
    Social: 'var(--tag-soc-bg)',
    'Meio Ambiente': 'var(--tag-env-bg)',
    Saúde: 'var(--tag-hlt-bg)',
};

export default function ProfilePage() {
    const { currentUserRole } = useApp();
    const router = useRouter();
    const [voluntario, setVoluntario] = useState<Voluntario>(initialVoluntario);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quittingId, setQuittingId] = useState<string | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [profileForm] = Form.useForm();

    const showEditProfileModal = () => {
        profileForm.setFieldsValue({
            nome: voluntario.name,
            cidade: voluntario.city,
            estado: voluntario.state,
            interestArea: voluntario.interestArea,
            availability: voluntario.availability,
            modality: voluntario.modality
        });
        setIsEditModalVisible(true);
    };

    const handleEditProfileSubmit = async (values: any) => {
        try {
            const res = await fetch('/api/v1/auth/me/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: values.nome,
                    city: values.cidade,
                    state: values.estado,
                    interestArea: values.interestArea,
                    availability: values.availability,
                    modality: values.modality
                })
            });

            if (res.ok) {
                message.success('Perfil atualizado com sucesso!');
                setVoluntario(prev => ({
                    ...prev,
                    name: values.nome,
                    city: values.cidade,
                    state: values.estado,
                    interestArea: values.interestArea,
                    availability: values.availability,
                    modality: values.modality
                }));
                setIsEditModalVisible(false);
            } else {
                const data = await res.json();
                message.error(data.error || 'Erro ao atualizar perfil.');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            message.error('Erro de conexão ao atualizar perfil.');
        }
    };

    const handleQuit = async (trabalho_id: string) => {
        if (!window.confirm('Tem certeza que deseja cancelar sua inscrição?')) return;
        setQuittingId(trabalho_id);
        try {
            const res = await fetch('/api/v1/trabalho/quit', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trabalho_id })
            });
            const data = await res.json();
            if (res.ok) {
                message.success('Inscrição cancelada com sucesso.');
                setVoluntario(prev => {
                    const newHistorico = prev.historico.filter(h => h.id !== trabalho_id);
                    return {
                        ...prev,
                        historico: newHistorico,
                        totalHours: newHistorico.reduce((acc, h) => acc + (h.hours || 0), 0)
                    };
                });
            } else {
                message.error(data.error || 'Erro ao cancelar inscrição.');
            }
        } catch (err) {
            console.error('Quit error:', err);
            message.error('Erro de conexão ao remover inscrição.');
        } finally {
            setQuittingId(null);
        }
    };

    useEffect(() => {
        async function loadVoluntario() {
            try {
                // Fetch the actual volunteer profile associated with this account 
                const res = await fetch('/api/v1/auth/me'); // Just pulling session user context as standard for now
                if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
                const sessionData = await res.json();
                
                // Assuming we use user session defaults until volunteer API route handles specific info
                setVoluntario({
                    name: sessionData.nome || "Voluntário",
                    initials: "VL",
                    city: sessionData.city || 'São Paulo',
                    state: sessionData.state || 'SP',
                    memberSince: sessionData.memberSince || 2023,
                    interestArea: sessionData.interestArea || 'Educação',
                    availability: sessionData.availability || 'Fins de semana',
                    modality: sessionData.modality || 'Híbrido',
                    totalHours: sessionData.totalHours || 0,
                    historico: sessionData.historico || []
                });
            } catch (err) {
                console.error('Failed to load voluntario session:', err);
                setError('Não foi possível carregar os dados do perfil autenticado.');
            } finally {
                setLoading(false);
            }
        }

        loadVoluntario();
    }, []);

    if (loading) {
        return (
            <div className="page page--cream">
                <div className="container container--mid">
                    <div className="heading-serif" style={{ fontSize: 22 }}>
                        Carregando perfil...
                    </div>
                </div>
            </div>
        );
    }

    if (currentUserRole !== 'volunteer') {
        return (
            <div className="page page--cream">
                <Navbar />
                <div className="container container--mid" style={{ textAlign: 'center', marginTop: '100px' }}>
                    <div className="heading-serif" style={{ fontSize: 22, color: 'var(--gray-600)' }}>
                        Nenhum perfil de voluntário encontrado.
                    </div>
                    <p style={{ marginTop: 16 }}>Você está visualizando a plataforma como ONG ou Convidado.</p>
                </div>
            </div>
        );
    }

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
        <>
            <Navbar />
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
                        
                        <button 
                            className="btn btn--outline btn--sm mb-16" 
                            style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
                            onClick={showEditProfileModal}
                        >
                            Editar Perfil
                        </button>

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
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <div className="text-green" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1 }}>
                                        {h.hours}h
                                    </div>
                                    <div className="text-muted" style={{ fontSize: 11, marginTop: 2, marginBottom: 8 }}>horas</div>
                                    <button 
                                        className="btn btn--outline" 
                                        style={{ padding: '6px 12px', fontSize: 12, borderColor: '#ff4d4f', color: '#ff4d4f', fontWeight: 600 }}
                                        onClick={(e) => { e.stopPropagation(); handleQuit(h.id); }}
                                        disabled={quittingId === h.id}
                                    >
                                        {quittingId === h.id ? <Spin size="small" /> : 'Sair'}
                                    </button>
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

            <Modal
                title="Editar Perfil"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onOk={() => profileForm.submit()}
                okText="Salvar Alterações"
                cancelText="Cancelar"
            >
                <Form form={profileForm} layout="vertical" onFinish={handleEditProfileSubmit}>
                    <Form.Item name="nome" label="Nome Completo" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                        <Input />
                    </Form.Item>
                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item name="cidade" label="Cidade" rules={[{ required: true, message: 'Campo obrigatório' }]} style={{ flex: 1 }}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="estado" label="Estado" rules={[{ required: true, message: 'Campo obrigatório' }]} style={{ width: 100 }}>
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item name="interestArea" label="Área de Interesse Principal" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                        <Select>
                            <Option value="Educação">Educação</Option>
                            <Option value="Social">Social</Option>
                            <Option value="Meio Ambiente">Meio Ambiente</Option>
                            <Option value="Saúde">Saúde</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="availability" label="Disponibilidade" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                        <Input placeholder="Ex: Fins de semana, Manhãs" />
                    </Form.Item>
                    <Form.Item name="modality" label="Modalidade" rules={[{ required: true, message: 'Campo obrigatório' }]}>
                        <Select>
                            <Option value="Remoto">Remoto</Option>
                            <Option value="Presencial">Presencial</Option>
                            <Option value="Híbrido">Híbrido</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
