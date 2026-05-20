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

// ── Stock ─────────────────────────────────────────

export type TipoSanguineo =
  | 'A_POS'
  | 'A_NEG'
  | 'B_POS'
  | 'B_NEG'
  | 'O_POS'
  | 'O_NEG'
  | 'AB_POS'
  | 'AB_NEG';

export interface StockItem {
  id_stock: number;
  id_hospital: number;
  tipo_sanguineo: TipoSanguineo;
  quantidade_bolsas: number;
  ultima_atualizacao: string;
}

export interface MovimentoPayload {
  id_stock: number;
  quantidade: number; // positivo = entrada, negativo = consumo
  observacao?: string;
}

export interface MovimentoResponse {
  id_movimento: number;
  id_stock: number;
  quantidade: number;
  observacao: string | null;
  data_movimento: string;
}
