import { useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/utils/axios';
import {
  Hospital,
  HospitalLoginPayload,
  HospitalLoginResponse,
  RegisterHospitalPayload,
  RegisterHospitalResponse,
} from '@/types/hospital';
import { HospitalUser } from '@/types/hospital';

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

// ── Tipos ────────────────────────────────────────────────────────────────────

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useRegisterHospital = () => {
  return useMutation({
    mutationFn: async (
      payload: RegisterHospitalPayload
    ): Promise<RegisterHospitalResponse> => {
      const { data } = await api.post<RegisterHospitalResponse>(
        '/hospital/register',
        payload
      );
      return data;
    },
  });
};

// ── Hook ─────────────────────────────────────────────────────────────────────

export const useHospitalLogin = () => {
  return useMutation({
    mutationFn: async (
      payload: HospitalLoginPayload
    ): Promise<HospitalLoginResponse> => {
      const { data } = await api.post<HospitalLoginResponse>(
        '/hospital/login',
        payload
      );
      return data;
    },
  });
};

// ── Buscar perfil ─────────────────────────────────────────────────────────────

export const useHospitalProfile = (id: number | undefined) => {
  return useQuery({
    queryKey: ['hospital-profile', id],
    queryFn: async (): Promise<HospitalUser> => {
      const { data } = await api.get<HospitalUser>(`/hospital/${id}`);
      return data;
    },
    enabled: !!id, // só faz o pedido se o id existir
  });
};

// ── Alterar senha ─────────────────────────────────────────────────────────────

export interface ChangePasswordPayload {
  currentSenha: string;
  newSenha: string;
}

export const useChangeHospitalPassword = (id: number | undefined) => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload): Promise<void> => {
      await api.put(`/hospital/${id}/change-password`, payload);
      // backend responde 204 — sem body
    },
  });
};
