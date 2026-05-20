import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/utils/axios';
import {
  Hospital,
  HospitalLoginPayload,
  HospitalLoginResponse,
  MovimentoPayload,
  MovimentoResponse,
  RegisterHospitalPayload,
  RegisterHospitalResponse,
  StockItem,
} from '@/types/hospital';
import { HospitalUser } from '@/types/hospital';

export const getHospitals = async (): Promise<Hospital[]> => {
  const { data } = await api.get<Hospital[]>('/hospital');

  return data;
};

export const useHospitals = () => {
  return useQuery({
    queryKey: ['hospitals'],
    queryFn: getHospitals,
    staleTime: 1000 * 60 * 5, // 5min
    refetchOnWindowFocus: false,
  });
};

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

// ── Stocks ─────────────────────────────────────────────────────────────────────

export const stockQueryKey = (id_hospital: number) =>
  ['stock', 'hospital', id_hospital] as const;

// ── GET /stock/hospital/:id_hospital ─────────────────────────────────────────

export const useHospitalStock = (id_hospital: number | undefined) => {
  return useQuery({
    queryKey: id_hospital ? stockQueryKey(id_hospital) : ['stock', 'none'],
    queryFn: async (): Promise<StockItem[]> => {
      const { data } = await api.get(`/stock/hospital/${id_hospital}`);
      // Quando não há stock o backend retorna { status: 'error', message: '...' }
      // Tratamos isso como array vazio
      if (!Array.isArray(data)) return [];
      return data;
    },
    enabled: !!id_hospital,
  });
};

// ── POST /stockmovimento ───────────────────────────────────────────────────────────────

export const useStockMovimento = (id_hospital: number | undefined) => {
  const qc = useQueryClient();

  return useMutation<MovimentoResponse, Error, MovimentoPayload>({
    mutationFn: async (payload: MovimentoPayload) => {
      const res = await api.post('/stock/movimento', payload);
      return res.data;
    },
    onSuccess: () => {
      if (id_hospital) {
        qc.invalidateQueries({ queryKey: stockQueryKey(id_hospital) });
      }
    },
  });
};

// ─── useAddStock ──────────────────────────────────────────────────────────────
// Adiciona 1 bolsa (ou N bolsas) a um tipo sanguíneo já existente no stock.
// Para criar um novo tipo o backend deve ter a sua própria rota de criação;
// aqui assume-se que o id_stock já existe.

export const useAddStock = (id_hospital: number | undefined) => {
  const qc = useQueryClient();

  return useMutation<
    MovimentoResponse,
    Error,
    { id_stock: number; quantidade?: number; observacao?: string }
  >({
    mutationFn: async ({ id_stock, quantidade = 1, observacao }) => {
      const res = await api.post('/stock/movimento', {
        id_stock,
        quantidade, // positivo → entrada
        observacao,
      });
      return res.data;
    },
    onSuccess: () => {
      if (id_hospital) {
        qc.invalidateQueries({ queryKey: stockQueryKey(id_hospital) });
      }
    },
  });
};

// ─── useDecrementStock ────────────────────────────────────────────────────────
// Remove 1 bolsa do stock enviando quantidade negativa.

export const useDecrementStock = (id_hospital: number | undefined) => {
  const qc = useQueryClient();

  return useMutation<
    MovimentoResponse,
    Error,
    { id_stock: number; observacao?: string }
  >({
    mutationFn: async ({ id_stock, observacao }) => {
      const res = await api.post('/stock/movimento', {
        id_stock,
        quantidade: -1, // negativo → consumo
        observacao,
      });
      return res.data;
    },
    onSuccess: () => {
      if (id_hospital) {
        qc.invalidateQueries({ queryKey: stockQueryKey(id_hospital) });
      }
    },
  });
};
