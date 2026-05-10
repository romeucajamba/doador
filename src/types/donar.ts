export interface GamificationStatus {
  id_estatistica: number;
  id_doador: number;
  total_doacoes: number;
  vidas_salvas: number;
  total_centros: number;
  pontuacao: number;
  ultima_atualizacao: string;
}

export interface AppointmentDonor {
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
}

export interface AppointmentHospital {
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

export interface Appointment {
  id_agenda: number;
  id_doador: number;
  id_hospital: number;

  data_agendada: string;
  hora_agendada: string;

  status: 'pendente' | 'confirmada' | 'cancelada' | 'concluida';

  observacao_doador: string | null;
  observacao_hospital: string | null;

  data_criacao: string;
  data_atualizacao: string;

  doador: AppointmentDonor;
  hospital: AppointmentHospital;
}

export interface DonorNotification {
  id_notificacao: number;
  id_pedido: number;
  id_doador: number;
  mensagem_enviada: string;
  data_envio: string;
  status_envio: 'sucesso' | 'erro';
  codigo_erro: string;
}
