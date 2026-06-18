import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/axios';

export const useAdminStock = () => {
  return useQuery({
    queryKey: ['admin-data', 'stock'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/stock');
      return data;
    }
  });
};

export const useAdminPedidos = () => {
  return useQuery({
    queryKey: ['admin-data', 'pedidos'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/pedido');
      return data;
    }
  });
};

export const useAdminAgenda = () => {
  return useQuery({
    queryKey: ['admin-data', 'agenda'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/agenda');
      return data;
    }
  });
};

export const useAdminAuditoria = () => {
  return useQuery({
    queryKey: ['admin-data', 'auditoria'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/auditoria/log');
      return data;
    }
  });
};

export const useAdminComunicacao = () => {
  return useQuery({
    queryKey: ['admin-data', 'comunicacao'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/comunicacao/notificacao');
      return data;
    }
  });
};
