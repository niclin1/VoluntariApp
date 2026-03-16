export type ScreenId = 'welcome' | 'home' | 'vaga' | 'ong' | 'form' | 'profile';

export type Category = 'Educação' | 'Saúde' | 'Social' | 'Meio Ambiente';
export type Modality = 'Presencial' | 'Remoto' | 'Híbrido';
export type Availability = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo' | 'Fins de semana';
export type VagaStatus = 'Ativa' | 'Pausada' | 'Rascunho';

export interface Vaga {
  id: string;
  title: string;
  ong: string;
  city: string;
  category: Category;
  modality: Modality;
  availability: Availability;
  hoursPerWeek: string;
  totalSlots: number;
  filledSlots: number;
  startDate: string;
  description: string;
  requirements: string[];
  icon: string;
  status: VagaStatus;
}

export interface HistoricoItem {
  id: string;
  title: string;
  ong: string;
  period: string;
  hours: number;
  icon: string;
  category: Category;
}

export interface Voluntario {
  name: string;
  initials: string;
  city: string;
  state: string;
  memberSince: number;
  interestArea: Category;
  availability: Availability;
  modality: Modality;
  totalHours: number;
  historico: HistoricoItem[];
}

export interface ONG {
  name: string;
  city: string;
  state: string;
  since: number;
  activeVagas: number;
  totalVolunteers: number;
  vagas: Vaga[];
}

export interface NewVagaForm {
  title: string;
  description: string;
  slots: number;
  hoursPerWeek: string;
  category: Category | '';
  modality: Modality | '';
  availability: Availability[];
}
