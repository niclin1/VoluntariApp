import React from 'react';
import Link from 'next/link';
import { Form, Input, Button } from 'antd';
import { useRouter } from 'next/router';
import styles from './style.module.css';
import { useApp } from '../../context/AppContext';

export default function LoginPage() {
    const router = useRouter();
    const { userType } = useApp();
    const onFinish = (values: any) => {
        console.log('Login credentials:', values);
        router.push('/home');
    };

    return (
        <div className={styles.auth_wrapper}>
            <div className={styles.auth_card}>
                <div className={styles.auth_header}>
                    <div className={styles.auth_emoji}>🌱</div>
                    <h1 className={styles.auth_title}>Bem-vindo de volta</h1>
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
                        <Button type="primary" htmlType="submit" block size="large">
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
