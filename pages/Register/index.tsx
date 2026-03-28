import React from 'react';
import Link from 'next/link';
import { Form, Input, Button } from 'antd';
import { useRouter } from 'next/router';
import styles from './style.module.css';
import { useApp } from '../../context/AppContext';

export default function RegisterPage() {
    const router = useRouter();
    const { userType } = useApp();

    const onFinish = (values: any) => {
        console.log('Registration details:', values);

        router.push('/home');
    };

    return (
        <div className={styles.auth_wrapper}>
            <div className={styles.auth_card}>
                <div className={styles.auth_header}>
                    <div className={styles.auth_emoji}>🤝</div>
                    <h1 className={styles.auth_title}>Crie sua conta</h1>
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
                        <Button type="primary" htmlType="submit" block size="large">
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
