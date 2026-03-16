import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Category, Modality, Availability, NewVagaForm } from '../models/types';
import { FormInput, FormTextarea, Chip } from '../components/UI';

const steps = ['Dados básicos', 'Detalhes', 'Revisão'];

const categories: Category[] = ['Educação', 'Saúde', 'Social', 'Meio Ambiente'];
const modalities: Modality[] = ['Presencial', 'Remoto', 'Híbrido'];
const availabilities: Availability[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

const initialForm: NewVagaForm = {
    title: 'Instrutor de Inglês',
    description: 'Buscamos voluntário para ministrar aulas básicas de inglês para jovens de 14 a 18 anos...',
    slots: 6,
    hoursPerWeek: '2h/semana',
    category: 'Educação',
    modality: 'Presencial',
    availability: ['Quarta', 'Sexta'],
};

export default function FormPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [form, setForm] = useState<NewVagaForm>(initialForm);

    const toggleAvailability = (a: Availability) => {
        setForm(f => ({
            ...f,
            availability: f.availability.includes(a)
                ? f.availability.filter(x => x !== a)
                : [...f.availability, a],
        }));
    };

    return (
        <div className="page page--cream">
            <div className="container container--narrow">

                {/* Stepper */}
                <div className="stepper">
                    <div className="stepper__inner">
                        {steps.map((step, i) => (
                            <React.Fragment key={step}>
                                <div className="stepper__step">
                                    <div className={`stepper__circle ${i < currentStep ? 'stepper__circle--done' :
                                        i === currentStep ? 'stepper__circle--current' :
                                            'stepper__circle--pending'
                                        }`}>
                                        {i < currentStep ? '✓' : i + 1}
                                    </div>
                                    <div className="stepper__label" style={{
                                        color: i <= currentStep ? 'var(--green-700)' : 'var(--gray-400)',
                                    }}>
                                        {step}
                                    </div>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`stepper__line ${i < currentStep ? 'stepper__line--done' : 'stepper__line--pending'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Card */}
                <div className="card" style={{ padding: 36 }}>
                    <h2 className="heading-serif mb-6" style={{ fontSize: 22 }}>
                        Detalhes da oportunidade
                    </h2>
                    <p className="text-muted mb-28" style={{ fontSize: 14 }}>
                        Passo {currentStep + 1} de {steps.length} — Descreva a vaga para atrair voluntários
                    </p>

                    <div className="flex flex-col gap-24" style={{ gap: 24 }}>
                        <FormInput
                            label="Título da vaga"
                            required
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        />

                        <FormTextarea
                            label="Descrição"
                            required
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <FormInput
                                label="Nº de Vagas"
                                type="number"
                                value={form.slots}
                                onChange={e => setForm(f => ({ ...f, slots: +e.target.value }))}
                            />
                            <FormInput
                                label="Carga Horária"
                                value={form.hoursPerWeek}
                                onChange={e => setForm(f => ({ ...f, hoursPerWeek: e.target.value }))}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <div className="form-label mb-12">Categoria</div>
                            <div className="flex gap-8 flex-wrap">
                                {categories.map(c => (
                                    <Chip
                                        key={c}
                                        label={c}
                                        active={form.category === c}
                                        onClick={() => setForm(f => ({ ...f, category: c }))}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Modality */}
                        <div>
                            <div className="form-label mb-12">Modalidade</div>
                            <div className="flex gap-8">
                                {modalities.map(m => (
                                    <Chip
                                        key={m}
                                        label={m}
                                        active={form.modality === m}
                                        onClick={() => setForm(f => ({ ...f, modality: m }))}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div>
                            <div className="form-label mb-12">Disponibilidade</div>
                            <div className="flex gap-8 flex-wrap">
                                {availabilities.map(a => (
                                    <Chip
                                        key={a}
                                        label={a}
                                        active={form.availability.includes(a)}
                                        onClick={() => toggleAvailability(a)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between" style={{ marginTop: 36 }}>
                        <button
                            onClick={() => currentStep > 0 ? setCurrentStep(s => s - 1) : router.push('/ong')}
                            className="btn btn--secondary btn--lg"
                        >
                            ← Voltar
                        </button>
                        <button
                            onClick={() => currentStep < steps.length - 1 ? setCurrentStep(s => s + 1) : router.push('/ong')}
                            className="btn btn--primary btn--lg"
                        >
                            {currentStep < steps.length - 1 ? 'Próximo →' : 'Publicar Vaga ✓'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
