// src/service/hospital/index.ts

import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/axios';
import { Hospital } from '@/types/hospital';

export const getHospitals = async (): Promise<Hospital[]> => {
  const { data } = await api.get<Hospital[]>('/hospital');

  return data;
};

/* ────────────────────────────────────────────────
 * React Query Hook
──────────────────────────────────────────────── */

export const useHospitals = () => {
  return useQuery({
    queryKey: ['hospitals'],
    queryFn: getHospitals,
    staleTime: 1000 * 60 * 5, // 5min
    refetchOnWindowFocus: false,
  });
};
