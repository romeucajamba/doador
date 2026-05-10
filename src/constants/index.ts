import { TipoSanguineo } from '@/types/donar';
// ── Municípios de Luanda com os IDs que o backend conhece ────────────────────
export const MUNICIPIOS_LUANDA = [
  { id: 1, nome: 'Luanda' },
  { id: 2, nome: 'Viana' },
  { id: 3, nome: 'Cazenga' },
  { id: 4, nome: 'Talatona' },
  { id: 5, nome: 'Kilamba Kiaxi' },
  { id: 6, nome: 'Cacuaco' },
  { id: 7, nome: 'Mulenvos' },
  { id: 8, nome: 'Quiçama' },
  { id: 9, nome: 'Icolo e Bengo' },
  { id: 10, nome: 'Belas' },
  { id: 11, nome: 'Rangel' },
  { id: 12, nome: 'Sambizanga' },
  { id: 13, nome: 'Benfica' },
  { id: 14, nome: 'Camama' },
  { id: 15, nome: 'Hoji-ya-Henda' },
  { id: 16, nome: 'Ingombota' },
  { id: 17, nome: 'Kilamba' },
  { id: 18, nome: 'Maianga' },
  { id: 19, nome: 'Mussulo' },
  { id: 20, nome: 'Samba' },
  { id: 21, nome: 'Sequele' },
] as const;

// ── Tipos sanguíneos — label visível / valor para o backend ──────────────────
export const BLOOD_TYPES: { label: string; value: TipoSanguineo }[] = [
  { label: 'A+', value: 'A_POS' },
  { label: 'A-', value: 'A_NEG' },
  { label: 'B+', value: 'B_POS' },
  { label: 'B-', value: 'B_NEG' },
  { label: 'O+', value: 'O_POS' },
  { label: 'O-', value: 'O_NEG' },
  { label: 'AB+', value: 'AB_POS' },
  { label: 'AB-', value: 'AB_NEG' },
];
