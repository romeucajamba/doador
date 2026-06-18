export type StatusAdmin = 'ativo' | 'inativo';

export interface Admin {
  id_admin: number;
  nome_completo: string;
  email: string;
  status: StatusAdmin;
  data_criacao: string;
}

export interface AdminLoginPayload {
  email: string;
  senha: string;
}

export interface AdminLoginResponse {
  token: string;
  user: Admin;
}

export interface AdminRegisterPayload {
  nome_completo: string;
  email: string;
  senha?: string;
}
