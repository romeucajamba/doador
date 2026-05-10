import { DonorNotification } from '@/types/donar';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/axios';

export const getDonorNotifications = async (
  donorId: number
): Promise<DonorNotification[]> => {
  const { data } = await api.get(`/comunicacao/notificacao/doador/${donorId}`);

  return data;
};

export const useDonorNotifications = (donorId?: number) => {
  return useQuery({
    queryKey: ['donor-notifications', donorId],
    queryFn: () => getDonorNotifications(donorId as number),
    enabled: !!donorId,
  });
};
