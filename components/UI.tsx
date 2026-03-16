import React, { ReactNode } from 'react';
import { Category, Modality, Availability } from '../models/types';

// ── Tag / Chip ──────────────────────────────────────────────
const categoryStyles: Record<Category, { bg: string; color: string }> = {
  Educação: { bg: 'var(--tag-edu-bg)', color: 'var(--tag-edu-fg)' },
  Social: { bg: 'var(--tag-soc-bg)', color: 'var(--tag-soc-fg)' },
  'Meio Ambiente': { bg: 'var(--tag-env-bg)', color: 'var(--tag-env-fg)' },
  Saúde: { bg: 'var(--tag-hlt-bg)', color: 'var(--tag-hlt-fg)' },
};

const categoryEmoji: Record<Category, string> = {
  Educação: '📚',
  Social: '🤝',
  'Meio Ambiente': '🌿',
  Saúde: '💚',
};

export const CategoryTag = ({ category }: { category: Category }) => {
  const style = categoryStyles[category];
  return (
    <span className="tag" style={{ background: style.bg, color: style.color }}>
      {categoryEmoji[category]} {category}
    </span>
  );
};

export const ModalityTag = ({ modality }: { modality: Modality }) => {
  const styles: Record<Modality, { bg: string; color: string }> = {
    Presencial: { bg: 'var(--tag-pres-bg)', color: 'var(--tag-pres-fg)' },
    Remoto: { bg: '#e8f0fe', color: '#2a4a9a' },
    Híbrido: { bg: '#f0f4e8', color: '#4a6020' },
  };
  const s = styles[modality];
  return (
    <span className="tag" style={{ background: s.bg, color: s.color }}>
      🏠 {modality}
    </span>
  );
};

export const AvailabilityTag = ({ availability }: { availability: Availability }) => (
  <span className="tag" style={{ background: 'var(--tag-wknd-bg)', color: 'var(--tag-wknd-fg)' }}>
    📅 {availability}
  </span>
);

export const StatusBadge = ({ status }: { status: string }) => {
  const active = status === 'Ativa';
  return (
    <span className="tag" style={{
      background: active ? 'var(--tag-edu-bg)' : 'var(--gray-200)',
      color: active ? 'var(--tag-edu-fg)' : 'var(--gray-600)',
      padding: '5px 12px', fontSize: 12,
    }}>
      {status}
    </span>
  );
};

// ── Button ──────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps & { className?: string }) => (
  <button className={`btn btn--${variant} btn--${size} ${className}`} {...props}>
    {children}
  </button>
);

// ── Card ────────────────────────────────────────────────────
export const Card = ({
  children, className = '', onClick, style,
}: { children: ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`card${onClick ? ' card--clickable' : ''} ${className}`}
    style={style}
  >
    {children}
  </div>
);

// ── Avatar ──────────────────────────────────────────────────
export const Avatar = ({
  initials, size = 40,
}: { initials: string; size?: number }) => (
  <div
    className="avatar"
    style={{ width: size, height: size, fontSize: size * 0.35 }}
  >
    {initials}
  </div>
);

// ── Icon Box ────────────────────────────────────────────────
export const IconBox = ({
  emoji, bg = 'var(--tag-edu-bg)', size = 44,
}: { emoji: string; bg?: string; size?: number }) => (
  <div
    className="icon-box"
    style={{
      width: size, height: size, borderRadius: size * 0.22,
      background: bg, fontSize: size * 0.5,
    }}
  >
    {emoji}
  </div>
);

// ── Section Header ──────────────────────────────────────────
export const SectionHeader = ({
  title, action, onAction,
}: { title: string; action?: string; onAction?: () => void }) => (
  <div className="section-header">
    <span className="label-upper">{title}</span>
    {action && (
      <button onClick={onAction} className="section-header__action">
        {action} →
      </button>
    )}
  </div>
);

// ── Divider ─────────────────────────────────────────────────
export const Divider = ({ style }: { style?: React.CSSProperties }) => (
  <div className="divider" style={style} />
);

// ── Progress Bar ────────────────────────────────────────────
export const ProgressBar = ({
  value, max, showLabel = true,
}: { value: number; max: number; showLabel?: boolean }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="progress-bar">
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      {showLabel && (
        <span className="progress-bar__label">{value} / {max}</span>
      )}
    </div>
  );
};

// ── Form Input ──────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}
export const FormInput = ({ label, required, ...props }: InputProps) => (
  <div className="form-group">
    <label className="form-label">
      {label} {required && <span className="form-label__required">*</span>}
    </label>
    <input className="form-input" {...props} />
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
}
export const FormTextarea = ({ label, required, ...props }: TextareaProps) => (
  <div className="form-group">
    <label className="form-label">
      {label} {required && <span className="form-label__required">*</span>}
    </label>
    <textarea className="form-textarea" {...props} />
  </div>
);

// ── Chip selector ───────────────────────────────────────────
export const Chip = ({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`chip${active ? ' chip--active' : ''}`}
  >
    {label}
  </button>
);
