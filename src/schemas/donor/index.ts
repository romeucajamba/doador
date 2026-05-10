import z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Endereço de e-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export const profileSchema = z.object({
  nome_completo: z.string().min(2, 'Nome inválido'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(7, 'Telefone inválido'),
  tipo_sanguineo: z.string(),
});

export const registerSchema = z.object({
  role: z.enum(['donor', 'hospital']),
  // Campos partilhados
  nome_completo: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z
    .string()
    .email('Endereço de e-mail inválido')
    .optional()
    .or(z.literal('')),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  telefone: z.string().min(9, 'Insira um número válido'),
  id_municipio: z.coerce.number().int().positive('Seleccione um município'),
  // Apenas doador
  tipo_sanguineo: z.string().optional(),
  data_nascimento: z.string().optional(),
  consentimento_sms: z.boolean().optional(),
  // Apenas hospital (mantido para não quebrar o schema)
  address: z.string().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
