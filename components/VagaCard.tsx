import React from 'react';
import { useRouter } from 'next/router';
import { Vaga } from '../models/types';
import { CategoryTag, AvailabilityTag, ModalityTag, Button, IconBox } from './UI';
import { useApp } from '../context/AppContext';

interface VagaCardProps {
  vaga: Vaga;
}

const iconBgMap: Record<string, string> = {
  '🌱': 'var(--tag-edu-bg)',
  '🤝': 'var(--tag-soc-bg)',
  '🌳': 'var(--tag-env-bg)',
  '📚': 'var(--tag-edu-bg)',
  '💚': 'var(--tag-hlt-bg)',
  '🎨': '#fce8f8',
};

export const VagaCard = ({ vaga }: VagaCardProps) => {
  const router = useRouter();
  const { setSelectedVaga } = useApp();

  const handleView = () => {
    setSelectedVaga(vaga);
    router.push(`/vaga?id=${vaga.id}`);
  };

  return (
    <div onClick={handleView} className="card card--clickable mb-16" style={{ padding: 22 }}>
      {/* Header */}
      <div className="flex gap-14 mb-14" style={{ alignItems: 'flex-start' }}>
        <IconBox
          emoji={vaga.icon}
          bg={iconBgMap[vaga.icon] || 'var(--tag-edu-bg)'}
          size={44}
        />
        <div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)', fontWeight: 500, marginBottom: 2 }}>
            {vaga.ong} · {vaga.city}
          </div>
          <div className="heading-serif" style={{ fontSize: 17, lineHeight: 1.2 }}>
            {vaga.title}
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-8 flex-wrap mb-14">
        <CategoryTag category={vaga.category} />
        <AvailabilityTag availability={vaga.availability} />
        <ModalityTag modality={vaga.modality} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 13, color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: 5 }}>
          👥 {vaga.totalSlots - vaga.filledSlots} vagas restantes
        </span>
        <Button
          variant="primary"
          size="sm"
          onClick={e => { e.stopPropagation(); handleView(); }}
        >
          Ver mais
        </Button>
      </div>
    </div>
  );
};
