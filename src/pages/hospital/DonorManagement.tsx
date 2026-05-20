import * as React from 'react';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MdSearch,
  MdEmail,
  MdPhone,
  MdCheckCircle,
  MdClose,
  MdPerson,
  MdBloodtype,
  MdCalendarToday,
  MdMessage,
  MdHourglassEmpty,
} from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useHospitalAuthStore } from '@/hooks/hospitalAuth';
import { api } from '@/utils/axios';

// ─── Types ────────────────────────────────────────────────────────────────────

type PedidoStatus = 'pendente' | 'aceite' | 'rejeitado';
type FilterStatus = 'all' | PedidoStatus;

interface Doador {
  id_doador: number;
  nome_completo: string;
  telefone: string;
  email: string;
  tipo_sanguineo: string;
  data_nascimento: string;
  data_cadastro: string;
  status: string;
  consentimento_sms: boolean;
}

interface PedidoDoacao {
  id_pedido_doacao: number;
  id_doador: number;
  id_hospital: number;
  mensagem: string;
  status: PedidoStatus;
  motivo_rejeicao: string | null;
  data_solicitacao: string;
  data_resposta: string | null;
  doador: Doador;
}

// ─── API helpers ──────────────────────────────────────────────────────────────

const pedidosQueryKey = (id_hospital: number) =>
  ['pedidos-doacao', id_hospital] as const;

const usePedidosDoacao = (id_hospital: number | undefined) =>
  useQuery<PedidoDoacao[]>({
    queryKey: id_hospital
      ? pedidosQueryKey(id_hospital)
      : ['pedidos-doacao-none'],
    queryFn: async () => {
      const { data } = await api.get(`/pedido/doacao/hospital/${id_hospital}`);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!id_hospital,
  });

const useAnswerDoacao = (id_hospital: number | undefined) => {
  const qc = useQueryClient();
  return useMutation<
    PedidoDoacao,
    Error,
    { id_pedido: number; status: 'aceite' | 'rejeitado' }
  >({
    mutationFn: async ({ id_pedido, status }) => {
      const { data } = await api.put(`/pedido/doacao/${id_pedido}/answer`, {
        status,
      });
      return data;
    },
    onSuccess: () => {
      if (id_hospital)
        qc.invalidateQueries({ queryKey: pedidosQueryKey(id_hospital) });
    },
  });
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Converte "B_POS" → "B+" , "AB_NEG" → "AB-", etc.
const formatBloodType = (raw: string): string =>
  raw.replace('_POS', '+').replace('_NEG', '-').replace('_', '');

const formatDate = (iso: string | null): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-AO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
];

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'aceite', label: 'Aceites' },
  { value: 'rejeitado', label: 'Rejeitados' },
];

const statusBadge: Record<PedidoStatus, { label: string; className: string }> =
  {
    pendente: {
      label: 'Pendente',
      className:
        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/40',
    },
    aceite: {
      label: 'Aceite',
      className:
        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/40',
    },
    rejeitado: {
      label: 'Rejeitado',
      className:
        'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900/40',
    },
  };

// ─── Toast ────────────────────────────────────────────────────────────────────

type ToastState = { message: string; type: 'success' | 'error' } | null;

const useToast = () => {
  const [toast, setToast] = useState<ToastState>(null);
  const show = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  return { toast, show };
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const DonorManagement: React.FC = () => {
  const user = useHospitalAuthStore((s) => s.user);
  const id_hospital = user?.id_hospital;

  const {
    data: pedidos = [],
    isLoading,
    isError,
  } = usePedidosDoacao(id_hospital);
  const { mutate: answerDoacao, isPending: isAnswering } =
    useAnswerDoacao(id_hospital);
  const { toast, show: showToast } = useToast();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      pedidos.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          p.doador.nome_completo.toLowerCase().includes(q) ||
          p.doador.email.toLowerCase().includes(q) ||
          formatBloodType(p.doador.tipo_sanguineo).toLowerCase().includes(q);
        const matchStatus = filterStatus === 'all' || p.status === filterStatus;
        return matchSearch && matchStatus;
      }),
    [pedidos, search, filterStatus]
  );

  const pendentes = pedidos.filter((p) => p.status === 'pendente').length;
  const aceites = pedidos.filter((p) => p.status === 'aceite').length;
  const rejeitados = pedidos.filter((p) => p.status === 'rejeitado').length;

  const handleAnswer = (id_pedido: number, status: 'aceite' | 'rejeitado') => {
    setLoadingId(id_pedido);
    answerDoacao(
      { id_pedido, status },
      {
        onSuccess: () => {
          showToast(
            status === 'aceite'
              ? 'Doação aceite com sucesso.'
              : 'Pedido rejeitado.',
            status === 'aceite' ? 'success' : 'error'
          );
          setLoadingId(null);
        },
        onError: () => {
          showToast('Erro ao responder ao pedido.', 'error');
          setLoadingId(null);
        },
      }
    );
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto px-0 sm:px-2 animate-fadeUp">
      {/* Toast */}
      {toast && (
        <div
          className={cn(
            'fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold animate-slideDown max-w-xs',
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          )}
        >
          <MdCheckCircle className="text-lg shrink-0" />
          <span className="flex-1 min-w-0">{toast.message}</span>
          <button
            onClick={() => {}}
            className="text-white/70 hover:text-white shrink-0"
          >
            <MdClose className="text-sm" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Rede de Doadores
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
            Gerencie e responda aos pedidos de doação recebidos.
          </p>
        </div>
      </div>

      {/* Summary pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <MdPerson className="text-sm text-slate-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
          </span>
        </div>
        {pendentes > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 rounded-lg">
            <MdHourglassEmpty className="text-sm text-amber-500" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
              {pendentes} pendente{pendentes !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        {aceites > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {aceites} aceite{aceites !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        {rejeitados > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-950/40 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-xs font-bold text-red-700 dark:text-red-300">
              {rejeitados} rejeitado{rejeitados !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
          <input
            type="search"
            placeholder="Pesquisar por nome, e-mail ou tipo sanguíneo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-300 dark:focus:border-blue-700 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <MdClose className="text-sm" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilterStatus(value)}
              className={cn(
                'h-11 px-4 rounded-xl text-xs font-bold transition-all duration-200 border',
                filterStatus === value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(search || filterStatus !== 'all') && (
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          {search && (
            <>
              {' '}
              para{' '}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                "{search}"
              </span>
            </>
          )}
        </p>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="py-14 text-center bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm">
          <p className="text-slate-900 dark:text-white font-bold text-sm">
            Nenhum pedido encontrado
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="py-14 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <MdBloodtype className="text-4xl text-slate-200 dark:text-slate-700 mx-auto mb-2" />
          <p className="text-slate-900 dark:text-white font-bold text-sm">
            {pedidos.length === 0
              ? 'Nenhum pedido recebido ainda'
              : 'Nenhum resultado encontrado'}
          </p>
          <p className="text-slate-400 text-xs font-medium mt-1">
            {pedidos.length === 0
              ? 'Os pedidos de doação aparecerão aqui quando forem enviados.'
              : 'Tente uma pesquisa diferente.'}
          </p>
          {(search || filterStatus !== 'all') && (
            <Button
              onClick={() => {
                setSearch('');
                setFilterStatus('all');
              }}
              variant="outline"
              className="mt-4 rounded-xl font-semibold text-xs h-9 px-4 border-slate-200"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      )}

      {/* Donor grid */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
          {filtered.map((pedido, i) => {
            const { doador } = pedido;
            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const bloodType = formatBloodType(doador.tipo_sanguineo);
            const isLoading = loadingId === pedido.id_pedido_doacao;
            const sc = statusBadge[pedido.status];
            const isPendente = pedido.status === 'pendente';

            return (
              <Card
                key={pedido.id_pedido_doacao}
                className="border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md overflow-hidden rounded-2xl bg-white dark:bg-slate-900 transition-all duration-200 hover:-translate-y-0.5 group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CardContent className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'size-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all duration-200',
                          avatarColor
                        )}
                      >
                        {getInitials(doador.nome_completo)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {doador.nome_completo}
                        </h3>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                          ID #{pedido.id_pedido_doacao}
                        </p>
                      </div>
                    </div>
                    {/* Tipo sanguíneo */}
                    <div className="size-11 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex flex-col items-center justify-center text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40 shrink-0">
                      <span className="text-sm font-black leading-none">
                        {bloodType}
                      </span>
                      <span className="text-[8px] font-bold uppercase mt-0.5 opacity-70">
                        Tipo
                      </span>
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-lg">
                      <MdEmail className="text-sm text-blue-500 shrink-0" />
                      <span className="truncate">{doador.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-lg">
                      <MdPhone className="text-sm text-blue-500 shrink-0" />
                      <span>{doador.telefone}</span>
                    </div>
                    {pedido.mensagem && (
                      <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-lg">
                        <MdMessage className="text-sm text-blue-500 shrink-0 mt-0.5" />
                        <span className="italic line-clamp-2">
                          {pedido.mensagem}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer: datas + status */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">
                        Solicitado em
                      </p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <MdCalendarToday className="text-slate-400 text-[10px]" />
                        {formatDate(pedido.data_solicitacao)}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        'text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-lg border',
                        sc.className
                      )}
                    >
                      {sc.label}
                    </Badge>
                  </div>

                  {/* Data resposta (se respondido) */}
                  {pedido.data_resposta && !isPendente && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                      Respondido em {formatDate(pedido.data_resposta)}
                    </p>
                  )}

                  {/* CTA */}
                  {isPendente ? (
                    <div className="flex gap-2 pt-1">
                      <Button
                        onClick={() =>
                          handleAnswer(pedido.id_pedido_doacao, 'aceite')
                        }
                        disabled={isLoading || isAnswering}
                        className="flex-1 h-9 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                      >
                        {isLoading ? <LoadingDots /> : 'Aceitar'}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleAnswer(pedido.id_pedido_doacao, 'rejeitado')
                        }
                        disabled={isLoading || isAnswering}
                        className="flex-1 h-9 rounded-xl text-xs font-bold"
                      >
                        {isLoading ? <LoadingDots /> : 'Rejeitar'}
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'flex items-center justify-center h-9 rounded-xl border text-xs font-bold',
                        pedido.status === 'aceite'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-300'
                      )}
                    >
                      {pedido.status === 'aceite'
                        ? '✅ Doação aceite'
                        : '✕ Pedido rejeitado'}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeUp { animation: fadeUp 0.45s ease both; }
        .animate-slideDown { animation: slideDown 0.3s ease both; }
      `}</style>
    </div>
  );
};

const LoadingDots: React.FC = () => (
  <span className="flex items-center gap-0.5">
    {[0, 150, 300].map((d) => (
      <span
        key={d}
        className="w-1 h-1 rounded-full bg-current animate-bounce"
        style={{ animationDelay: `${d}ms` }}
      />
    ))}
  </span>
);
