export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
  role: 'donor' | 'hospital';
}

export interface AuthUser {
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

export interface AuthInfo {
  message: string;
  token: string;
}

export interface AuthMensagem {
  token: string;
}

export interface AuthSession {
  token: string;
  role: 'donor' | 'hospital';
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ResetPasswordData {
  email: string;
}
