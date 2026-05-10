import z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Endereço de e-mail inválido'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const profileSchema = z.object({
  nome_completo: z.string().min(2, 'Nome inválido'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(7, 'Telefone inválido'),
  tipo_sanguineo: z.string(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
