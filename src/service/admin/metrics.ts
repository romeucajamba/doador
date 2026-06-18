import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/axios';

// Interfaces simplificadas para contagem
export const useMetrics = () => {
  const stockQuery = useQuery({
    queryKey: ['metrics', 'stock'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/stock');
      return data;
    },
    retry: false,
  });

  const pedidoQuery = useQuery({
    queryKey: ['metrics', 'pedido'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/pedido');
      return data;
    },
    retry: false,
  });

  const agendaQuery = useQuery({
    queryKey: ['metrics', 'agenda'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/agenda');
      return data;
    },
    retry: false,
  });

  const auditoriaQuery = useQuery({
    queryKey: ['metrics', 'auditoria'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/auditoria/log');
      return data;
    },
    retry: false,
  });

  const rankingQuery = useQuery({
    queryKey: ['metrics', 'ranking'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/gamificacao/ranking/top');
      return data;
    },
    retry: false,
  });

  return {
    stock: stockQuery.data,
    pedidos: pedidoQuery.data,
    agendas: agendaQuery.data,
    logs: auditoriaQuery.data,
    ranking: rankingQuery.data,
    isLoading:
      stockQuery.isLoading ||
      pedidoQuery.isLoading ||
      agendaQuery.isLoading ||
      auditoriaQuery.isLoading ||
      rankingQuery.isLoading,
  };
};
