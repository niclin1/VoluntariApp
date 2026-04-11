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
            // First, register generic "Usuario" Auth
            const userResponse = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: values.nome,
                    email: values.email,
                    password: values.password,
                    city: values.localidade || "Não informado",
                    state: "SP", // Hardcoded proxy for now, ideally user inputs state
                    interestArea: "Outros",
                    availability: "Integral",
                    modality: "Remoto",
                    role: userType // Pass the correct role from the switcher!
                }),
            });

            if (!userResponse.ok) {
                const data = await userResponse.json();
                message.error(data.error || 'Erro ao registrar usuário');       
                setLoading(false);
                return;
            }

            const userData = await userResponse.json();

            // Then if it's an ONG, ALSO register their specific ONG details
            if (userType === 'ong') {
                const ongResponse = await fetch('/api/v1/ong', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nome: values.nome,
                        email: values.email,
                        localidade: values.localidade || "Não informado",
                        telefone: values.telefone || "000000000"
                    }),
                });

                const ongData = await ongResponse.json();

                if (!ongResponse.ok) {
                    message.error(ongData.error || 'Autenticado, mas falha ao cadastrar detalhes da ONG');       
                    return;
                }
            }
            
            message.success('Cadastro realizado com sucesso!');
            setCurrentUserRole(userType); 
            router.push(userType === 'ong' ? '/ong' : '/Home');
            
        } catch (error) {
            message.error('Erro de conexão ao registrar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.auth_wrapper}>
            <div className={styles.auth_card}>
                <div className={styles.auth_header}>
                    <div className={styles.auth_emoji}>🌱</div>
                    <h1 className={styles.auth_title}>Criar uma conta</h1>

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
                            ? "Faça parte de uma comunidade que transforma!"
                            : "Encontre os melhores voluntários para sua causa!"}
                    </p>
                </div>

                <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[{ required: true, message: 'Insira seu nome/nome da ONG' }]}
                    >
                        <Input placeholder="Nome completo" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="E-mail"
                        name="email"
                        rules={[
                            { required: true, message: 'Insira seu e-mail' },
                            { type: 'email', message: 'E-mail inválido' }
                        ]}
                    >
                        <Input placeholder="seu@email.com" size="large" />
                    </Form.Item>

                    {userType === 'ong' && (
                        <>
                            <Form.Item
                                label="Telefone"
                                name="telefone"
                                rules={[{ required: true, message: 'Insira um telefone para a ONG' }]}
                            >
                                <Input placeholder="(11) 99999-9999" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Endereço / Localidade"
                                name="localidade"
                                rules={[{ required: true, message: 'Insira uma localidade para seus eventos' }]}
                            >
                                <Input placeholder="Av. Paulista, 1200 - São Paulo" size="large" />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        label="Senha"
                        name="password"
                        rules={[{ required: true, message: 'Crie uma senha de no mínimo 6 caracteres', min: 6 }]}
                    >
                        <Input.Password placeholder="••••••••" size="large" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Criar Conta →
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
