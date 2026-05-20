export interface Hospital {
  id_hospital: number;
  nome: string;
  nif: string;
  id_municipio: number;
  endereco: string;
  telefone: string;
  email: string;
  data_cadastro: string;
  status: string;
}

export type DonorSummary = {
  id_doador: number;
  nome_completo: string;
  telefone: string;
  email: string;
  tipo_sanguineo: string;
  id_municipio: number;
  data_nascimento: string;
  data_cadastro: string;
  status: string;
  consentimento_sms: boolean;
};

export type Agenda = {
  id_agenda: number;
  id_doador: number;
  id_hospital: number;
  data_agendada: string;
  hora_agendada: string;
  status: string;
  observacao_doador: string | null;
  observacao_hospital: string | null;
  data_criacao: string;
  data_atualizacao: string;
  doador: DonorSummary;
  hospital: Hospital;
};

export type CreateAgendaInput = {
  id_doador: number;
  id_hospital: number;
  data_agendada: string; // YYYY-MM-DD — o backend transforma em Date
  hora_agendada: string; // HH:MM      — o backend transforma em Date
  observacao_doador?: string;
};

// ── Tipos ────────────────────────────────────────────────────────────────────
export interface RegisterHospitalPayload {
  nome: string;
  nif: string;
  id_provincia: number;
  id_municipio: number;
  endereco: string;
  telefone: string;
  email: string;
  senha: string;
}

export interface RegisterHospitalResponse {
  access_token: string;
  token_type: string;
  hospital: {
    id: number;
    nome: string;
    email: string;
    id_municipio: number;
  };
}

//Login
export interface HospitalLoginPayload {
  email: string;
  senha: string;
}

export interface HospitalUser {
  id_hospital: number;
  nome: string;
  nif: string;
  id_municipio: number;
  endereco: string;
  telefone: string;
  email: string;
  data_cadastro: string;
  status: string;
}

export interface HospitalLoginResponse {
  message: string;
  user: HospitalUser;
  token: string;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
