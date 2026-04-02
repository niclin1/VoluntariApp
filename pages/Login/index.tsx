import React, { useState } from 'react';
import Link from 'next/link';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/router';
import styles from './style.module.css';
import { useApp } from '../../context/AppContext';

export default function LoginPage() {
    const router = useRouter();
    const { userType, setUserType, setCurrentUserRole } = useApp();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            if (userType === 'ong') {
                // Mock Auth: Fetch ONGs and verify if email exists in DB
                const response = await fetch('/api/v1/ong');
                const ongs = await response.json();
                const ongMatch = ongs.find((o: any) => o.email === values.email);

                if (ongMatch) {
                    message.success('Login bem-sucedido!');
                    setCurrentUserRole('ong');
                    router.push('/ong');
                } else {
                    message.error('E-mail não encontrado no sistema.');
                }
            } else {
                // Volunteer Mock Auth

                const response = await fetch('/api/v1/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(values),
                });
                if (!response.ok) {
                    throw new Error('Login failed')
                }
                message.success('Login como voluntário!');
                setCurrentUserRole('volunteer');
                router.push('/Home');
            }
        } catch (error) {
            message.error('Erro ao conectar ao servidor. ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.auth_wrapper}>
            <div className={styles.auth_card}>
                <div className={styles.auth_header}>
                    <div className={styles.auth_emoji}>🌱</div>
                    <h1 className={styles.auth_title}>Bem-vindo de volta</h1>

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
                            ? "Entre para continuar transformando vidas"
                            : "Entre para continuar gerenciando suas causas"}
                    </p>
                </div>

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    requiredMark={false}
                >
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

                    <Form.Item
                        label="Senha"
                        name="password"
                        rules={[{ required: true, message: 'Por favor, insira sua senha' }]}
                    >
                        <Input.Password placeholder="••••••••" size="large" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Entrar →
                        </Button>
                    </Form.Item>
                </Form>

                <div className={styles.auth_footer}>
                    Ainda não tem uma conta?{' '}
                    <Link href="/Register" className={styles.auth_link}>
                        Cadastre-se
                    </Link>
                </div>
            </div>
        </div>
    );
}
