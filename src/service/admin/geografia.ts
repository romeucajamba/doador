import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axios';
import {
  Provincia,
  Municipio,
  CreateProvinciaPayload,
  UpdateProvinciaPayload,
  CreateMunicipioPayload,
  UpdateMunicipioPayload,
} from '@/types/geografia';

// ======================
// PROVÍNCIAS
// ======================

export const useProvincias = () => {
  return useQuery({
    queryKey: ['provincias'],
    queryFn: async (): Promise<Provincia[]> => {
      const { data } = await api.get<Provincia[]>('/geografia/provincias');
      return data;
    },
  });
};

export const useCreateProvincia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateProvinciaPayload): Promise<Provincia> => {
      const { data } = await api.post<Provincia>(
        '/geografia/provincias',
        payload
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['provincias'] });
    },
  });
};

export const useUpdateProvincia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateProvinciaPayload;
    }): Promise<Provincia> => {
      const { data } = await api.put<Provincia>(
        `/geografia/provincias/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['provincias'] });
    },
  });
};

export const useDeleteProvincia = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/geografia/provincias/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['provincias'] });
    },
  });
};

// ======================
// MUNICÍPIOS
// ======================

export const useMunicipios = () => {
  return useQuery({
    queryKey: ['municipios'],
    queryFn: async (): Promise<Municipio[]> => {
      const { data } = await api.get<Municipio[]>('/geografia/municipios');
      return data;
    },
  });
};

export const useCreateMunicipio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateMunicipioPayload): Promise<Municipio> => {
      const { data } = await api.post<Municipio>(
        '/geografia/municipios',
        payload
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['municipios'] });
    },
  });
};

export const useUpdateMunicipio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateMunicipioPayload;
    }): Promise<Municipio> => {
      const { data } = await api.put<Municipio>(
        `/geografia/municipios/${id}`,
        payload
      );
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['municipios'] });
    },
  });
};

export const useDeleteMunicipio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/geografia/municipios/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['municipios'] });
    },
  });
};
