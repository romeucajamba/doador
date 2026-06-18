import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axios';

// Usamos o tipo genérico para simplificar, idealmente viria de @/types
export interface Donor {
  id_doador: number;
  nome_completo: string;
  email: string | null;
  telefone: string;
  tipo_sanguineo: string;
  id_municipio: number;
  data_cadastro: string;
  status: 'ativo' | 'inativo' | 'bloqueado';
  consentimento_sms: boolean;
}

export const useAdminDonors = () => {
  return useQuery({
    queryKey: ['admin-donors'],
    queryFn: async (): Promise<Donor[]> => {
      const { data } = await api.get<Donor[]>('/doador');
      return data;
    },
  });
};

export const useChangeDonorStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: 'ativo' | 'inativo' | 'bloqueado';
    }): Promise<Donor> => {
      const { data } = await api.patch<Donor>(`/admin/donors/${id}/status`, {
        status,
      });
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-donors'] });
    },
  });
};
