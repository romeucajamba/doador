import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axios';
import { Hospital } from '@/types/hospital';

export const useAdminHospitals = () => {
  return useQuery({
    queryKey: ['admin-hospitals'],
    queryFn: async (): Promise<Hospital[]> => {
      // Usamos a rota pública de listar hospitais para obter todos os hospitais
      // O backend pode retornar todos. Idealmente, teríamos uma rota no admin
      // mas vamos reutilizar a existente se ela retornar todos, incluindo pendentes.
      const { data } = await api.get<Hospital[]>('/hospital');
      return data;
    },
  });
};

export const useChangeHospitalStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: 'ativo' | 'suspenso' | 'inativo' | 'pendente';
    }): Promise<Hospital> => {
      const { data } = await api.patch<Hospital>(
        `/admin/hospitals/${id}/status`,
        { status }
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-hospitals'] });
    },
  });
};
