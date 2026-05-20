import { z } from 'zod';

// ── Schema do hospital ────────────────────────────────────────────────────────

export const hospitalRegisterSchema = z.object({
  role: z.literal('hospital'),

  nome: z
    .string()
    .min(3, 'O nome do hospital deve ter pelo menos 3 caracteres.')
    .max(150, 'Nome demasiado longo.'),

  nif: z
    .string()
    .max(20, 'NIF inválido.')
    .regex(/^\d+$/, 'O NIF deve conter apenas dígitos.'),

  id_municipio: z
    .string({ required_error: 'Seleccione o município.' })
    .min(1, 'Seleccione o município.'),

  endereco: z
    .string()
    .min(5, 'Endereço demasiado curto.')
    .max(255, 'Endereço demasiado longo.'),

  telefone: z
    .string()
    .min(9, 'Telefone inválido.')
    .max(15, 'Telefone inválido.')
    .regex(/^\d+$/, 'O telefone deve conter apenas dígitos.'),

  email: z
    .string()
    .email('Endereço de e-mail inválido.')
    .max(254, 'E-mail demasiado longo.'),

  senha: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula.')
    .regex(/[0-9]/, 'A senha deve conter pelo menos um número.')
    .regex(
      /[^A-Za-z0-9]/,
      'A senha deve conter pelo menos um caractere especial.'
    ),
});

export type HospitalRegisterFormValues = z.infer<typeof hospitalRegisterSchema>;
