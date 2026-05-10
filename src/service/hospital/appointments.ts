import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axios';
import { Agenda, CreateAgendaInput } from '@/types/hospital';

export const createAgenda = async (
  payload: CreateAgendaInput
): Promise<Agenda> => {
  const { data } = await api.post<Agenda>('/agenda', payload);
  return data;
};

export const useCreateAgenda = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAgenda,
    onSuccess: () => {
      // Invalida lista de agendamentos se existir
      queryClient.invalidateQueries({ queryKey: ['agendas'] });
    },
  });
};
