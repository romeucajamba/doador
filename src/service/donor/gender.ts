import { api } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { Appointment } from '@/types/donar';

/* =========================
   API Request
========================= */

export const getDonorAppointments = async (
  donorId: number
): Promise<Appointment[]> => {
  const { data } = await api.get(`/agenda/doador/${donorId}`);
  console.log('os dados da agenda', data);
  return data;
};

/* =========================
   React Query Hook
========================= */

export const useDonorAppointments = (donorId?: number) => {
  return useQuery({
    queryKey: ['donor-appointments', donorId],

    queryFn: () => getDonorAppointments(donorId!),

    enabled: !!donorId,

    staleTime: 1000 * 60 * 5,
  });
};
