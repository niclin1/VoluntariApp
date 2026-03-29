import React, { useState } from 'react';
import Link from 'next/link';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/router';
import styles from './style.module.css';
import { useApp } from '../../context/AppContext';

export default function RegisterPage() {
    const router = useRouter();
    const { userType, setUserType, setCurrentUserRole } = useApp();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        
        try {
            if (userType === 'ong') {
                const response = await fetch('/api/v1/ong', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nome: values.name,
                        email: values.email,
                        localidade: values.localidade,
                        telefone: values.telefone
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    message.success('ONG cadastrada com sucesso!');
                    setCurrentUserRole('ong'); // Provisional role assignment
                    router.push('/ong');
                } else {
                    message.error(data.error || 'Erro ao cadastrar ONG');
                }
            } else {
                // Future implementation of Volunteer Creation
                console.log('Registration details:', values);
                setCurrentUserRole('volunteer'); // Provisional role assignment
                router.push('/Home');
            }
        } catch (error) {
            message.error('Erro de conexão.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.auth_wrapper}>
            <div className={styles.auth_card}>
                <div className={styles.auth_header}>
                    <div className={styles.auth_emoji}>🤝</div>
                    <h1 className={styles.auth_title}>Crie sua conta</h1>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Button 
                            type={userType === 'volunteer' ? 'primary' : 'default'}
                            onClick={() => setUserType('volunteer')}
                        >
                            Voluntário
                        </Button>
                        <Button 
                            type={userType === 'ong' ? 'primary' : 'default'}
                            onClick={() => setUserType('ong')}
                        >
                            ONG
                        </Button>
                    </div>

                    <p className={styles.auth_subtitle}>
                        {userType === "volunteer"
                            ? "Junte-se à nossa rede de voluntários"
                            : "Crie sua conta para gerenciar suas causas"}
                    </p>
                </div>

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                >
                    <Form.Item
                        label="Nome Completo"
                        name="name"
                        rules={[{ required: true, message: 'Por favor, insira seu nome' }]}
                    >
                        <Input placeholder="Seu nome" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="E-mail"
                        name="email"
                        rules={[
                            { required: true, message: 'Por favor, insira seu e-mail' },
                            { type: 'email', message: 'Insira um e-mail válido' },
                        ]}
                    >
                        <Input placeholder="seu@email.com" size="large" />
                    </Form.Item>

                    {userType === 'ong' && (
                        <>
                            <Form.Item
                                label="Localidade"
                                name="localidade"
                                rules={[{ required: true, message: 'Por favor, insira a localidade' }]}
                            >
                                <Input placeholder="Ex: São Paulo - SP" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Telefone / WhatsApp"
                                name="telefone"
                                rules={[{ required: true, message: 'Por favor, insira o telefone' }]}
                            >
                                <Input placeholder="(11) 99999-9999" size="large" />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        label="Senha"
                        name="password"
                        rules={[{ required: true, message: 'Por favor, insira sua senha' }]}
                    >
                        <Input.Password placeholder="••••••••" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Confirmar Senha"
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Por favor, confirme sua senha' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('As senhas não coincidem!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="••••••••" size="large" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Registrar →
                        </Button>
                    </Form.Item>
                </Form>

                <div className={styles.auth_footer}>
                    Já tem uma conta?{' '}
                    <Link href="/Login" className={styles.auth_link}>
                        Faça login
                    </Link>
                </div>
            </div>
        </div>
    );
}
