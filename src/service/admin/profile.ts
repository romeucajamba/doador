import { useMutation } from '@tanstack/react-query';
import { api } from '@/utils/axios';
import { AdminLoginResponse } from '@/types/admin';

export interface UpdateAdminPayload {
  nome_completo?: string;
  email?: string;
  senha?: string;
}

export const useUpdateAdmin = (id: number) => {
  return useMutation({
    mutationFn: async (payload: UpdateAdminPayload) => {
      const { data } = await api.put<AdminLoginResponse['user']>(
        `/admin/${id}`,
        payload
      );
      return data;
    },
  });
};
