import { api } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { GamificationStatus } from '@/types/donar';

/* =========================
   Request
========================= */

export const getGamificationStatus = async (
  donorId: number
): Promise<GamificationStatus> => {
  const { data } = await api.get(`/gamificacao/status/${donorId}`);

  return data;
};

/* =========================
   React Query Hook
========================= */

export const useGamificationStatus = (donorId?: number) => {
  return useQuery({
    queryKey: ['gamification-status', donorId],
    queryFn: () => getGamificationStatus(donorId!),
    enabled: !!donorId,
    staleTime: 1000 * 60 * 5, // 5 min
  });
};
