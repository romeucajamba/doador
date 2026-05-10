import { useMutation } from '@tanstack/react-query';
import { api } from '@/utils/axios';
import { CreateDoadorInput, DoadorResponse } from '@/types/donar';

export const registerDoador = async (
  payload: CreateDoadorInput
): Promise<DoadorResponse> => {
  const { data } = await api.post<DoadorResponse>('/doador/register', payload);
  return data;
};

export const useRegisterDoador = () => {
  return useMutation({
    mutationFn: registerDoador,
  });
};
