import { LoginFormValues } from '@/schemas/donor/index';
import { AuthResponse } from '@/types/auth';
import { api } from '@/utils/axios';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export function useAuth(
  options?: UseMutationOptions<AuthResponse, AxiosError, LoginFormValues>
) {
  return useMutation<AuthResponse, AxiosError, LoginFormValues>({
    mutationFn: async (data: LoginFormValues) => {
      const response = await api.post<AuthResponse>('/doador/login', data);
      console.log(response);
      return response.data;
    },
    retry: 1,
    ...options,
  });
}
