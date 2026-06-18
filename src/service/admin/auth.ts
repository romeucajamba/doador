import { useMutation } from '@tanstack/react-query';
import { api } from '@/utils/axios';
import { AdminLoginPayload, AdminLoginResponse, AdminRegisterPayload, Admin } from '@/types/admin';

export const useAdminLogin = () => {
  return useMutation({
    mutationFn: async (
      payload: AdminLoginPayload
    ): Promise<AdminLoginResponse> => {
      const { data } = await api.post<AdminLoginResponse>(
        '/admin/auth/login',
        payload
      );
      return data;
    },
  });
};

export const useAdminRegister = () => {
  return useMutation({
    mutationFn: async (payload: AdminRegisterPayload): Promise<Admin> => {
      const { data } = await api.post<Admin>('/admin/register', payload);
      return data;
    },
  });
};
