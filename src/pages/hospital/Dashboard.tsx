import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  MdCheckCircle,
  MdClose,
  MdOpacity,
  MdPhone,
  MdBloodtype,
  MdPriorityHigh,
} from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { cn } from '@/lib/utils';
import { useHospitalAuthStore } from '@/hooks/hospitalAuth';
import { useHospitalStock } from '@/service/hospital/hospital';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/utils/axios';
import { TipoSanguineo, StockItem } from '@/types/hospital';
import { TIPO_LABEL, ALL_TYPES } from '@/constants/index';
import { motion, AnimatePresence } from 'framer-motion';

// ── Tipos ─────────────────────────────────────────────────────────────────────

type NivelUrgencia = 'urgente' | 'emergencia';
type StockStatus = 'critical' | 'low' | 'stable';
type ToastType = 'success' | 'error';

interface Toast {
  message: string;
  type: ToastType;
}

interface PedidoResponse {
  id_pedido: number;
  total_notificados: number;
  status_pedido: string;
}

// ── Schema do formulário de pedido urgente ────────────────────────────────────

const pedidoSchema = z.object({
  tipo_sanguineo_necessario: z.enum([
    'A_POS',
    'A_NEG',
    'B_POS',
    'B_NEG',
    'O_POS',
    'O_NEG',
    'AB_POS',
    'AB_NEG',
  ] as const),
  quantidade_necessaria: z.coerce
    .number()
    .int()
    .positive('Insira uma quantidade válida.')
    .optional(),
  contacto_referencia: z
    .string()
    .min(9, 'Contacto deve ter pelo menos 9 dígitos.')
    .max(15),
  nivel_urgencia: z.enum(['urgente', 'emergencia'] as const),
  mensagem_adicional: z.string().max(300).optional(),
});

type PedidoForm = z.infer<typeof pedidoSchema>;

// ── Status do stock ───────────────────────────────────────────────────────────

const getStockStatus = (units: number): StockStatus => {
  if (units < 5) return 'critical';
  if (units < 20) return 'low';
  return 'stable';
};

const STATUS_CONFIG: Record<
  StockStatus,
  { bar: string; label: string; badge: string }
> = {
  critical: {
    bar: 'bg-red-500',
    label: 'Crítico',
    badge:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900/40',
  },
  low: {
    bar: 'bg-amber-400',
    label: 'Baixo',
    badge:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/40',
  },
  stable: {
    bar: 'bg-blue-500',
    label: 'Estável',
    badge:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/40',
  },
};

// ── Componente principal ──────────────────────────────────────────────────────

export const HospitalDashboard: React.FC = () => {
  const user = useHospitalAuthStore((s) => s.user);
  const id_hospital = user?.id_hospital;

  const { data: stock = [], isLoading: stockLoading } =
    useHospitalStock(id_hospital);

  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [barWidths, setBarWidths] = useState<Record<string, number>>({});

  // Métricas derivadas do stock real
  const totalBolsas = stock.reduce((acc, s) => acc + s.quantidade_bolsas, 0);
  const tiposCriticos = stock.filter((s) => s.quantidade_bolsas < 5).length;
  const tiposEsgotados = stock.filter((s) => s.quantidade_bolsas === 0).length;
  const tiposRegistados = stock.length;

  // Anima as barras depois de carregar
  useEffect(() => {
    if (!stock.length) return;
    const maxQtd = Math.max(...stock.map((s) => s.quantidade_bolsas), 1);
    const timer = setTimeout(() => {
      const widths: Record<string, number> = {};
      stock.forEach((s) => {
        widths[s.tipo_sanguineo] = Math.min(
          (s.quantidade_bolsas / maxQtd) * 100,
          100
        );
      });
      setBarWidths(widths);
    }, 300);
    return () => clearTimeout(timer);
  }, [stock]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 4000);
    },
    []
  );

  return (
    <div className="space-y-5 max-w-6xl mx-auto px-0 sm:px-2 animate-fadeUp">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className={cn(
              'fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold max-w-xs',
              toast.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            )}
          >
            <MdCheckCircle className="text-lg shrink-0" />
            <span className="flex-1 min-w-0">{toast.message}</span>
            <button
              onClick={() => setToast(null)}
              className="text-white/70 hover:text-white shrink-0"
            >
              <MdClose className="text-sm" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {user?.nome ?? 'Dashboard'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
            Gestão de inventário e pedidos de emergência.
          </p>
        </div>
        <Button
          onClick={() => setShowPedidoModal(true)}
          className="h-9 px-4 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 hover:-translate-y-0.5 transition-all gap-1.5 self-start sm:self-auto"
        >
          <MdPriorityHigh className="text-base" /> Pedido de Emergência
        </Button>
      </div>

      {/* Métricas reais do stock */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard
          label="Total de Bolsas"
          value={stockLoading ? '—' : String(totalBolsas)}
          subValue="Em inventário agora"
          accent="blue"
        />
        <MetricCard
          label="Tipos Registados"
          value={stockLoading ? '—' : String(tiposRegistados)}
          subValue={`de ${ALL_TYPES.length} possíveis`}
          accent="slate"
        />
        <MetricCard
          label="Tipos Críticos"
          value={stockLoading ? '—' : String(tiposCriticos)}
          subValue="Menos de 5 bolsas"
          accent={tiposCriticos > 0 ? 'primary' : 'slate'}
          pulse={tiposCriticos > 0}
        />
        <MetricCard
          label="Tipos Esgotados"
          value={stockLoading ? '—' : String(tiposEsgotados)}
          subValue="Sem unidades"
          accent={tiposEsgotados > 0 ? 'primary' : 'slate'}
          pulse={tiposEsgotados > 0}
        />
      </div>

      {/* Gráfico de barras do stock */}
      <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-base font-black text-slate-900 dark:text-white">
            Níveis de Stock por Tipo Sanguíneo
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Inventário actual do hospital.
          </p>
        </CardHeader>
        <CardContent className="p-5">
          {/* Carregando */}
          {stockLoading && (
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-full h-20 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                  <div className="w-8 h-3 rounded bg-slate-100 dark:bg-slate-800 animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Sem stock */}
          {!stockLoading && stock.length === 0 && (
            <div className="flex flex-col items-center py-10 gap-3 text-center">
              <MdOpacity className="text-4xl text-slate-300 dark:text-slate-600" />
              <p className="text-slate-400 text-sm font-medium">
                Nenhum stock registado. Vá a <strong>Inventário</strong> para
                adicionar.
              </p>
            </div>
          )}

          {/* Barras */}
          {!stockLoading && stock.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
              {stock.map((item) => {
                const status = getStockStatus(item.quantidade_bolsas);
                const config = STATUS_CONFIG[status];
                return (
                  <div
                    key={item.id_stock}
                    className="flex flex-col items-center gap-2 group cursor-default"
                  >
                    <div className="w-full space-y-1.5">
                      <div className="relative h-20 w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-end">
                        <div
                          className={cn(
                            'w-full rounded-xl transition-all duration-1000 ease-out',
                            config.bar
                          )}
                          style={{
                            height: `${barWidths[item.tipo_sanguineo] ?? 0}%`,
                          }}
                        />
                        {status === 'critical' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                          </div>
                        )}
                      </div>
                      <div className="text-center space-y-0.5">
                        <p
                          className={cn(
                            'text-base font-black',
                            status === 'critical'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-slate-900 dark:text-white'
                          )}
                        >
                          {TIPO_LABEL[item.tipo_sanguineo]}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          {item.quantidade_bolsas} un.
                        </p>
                        <span
                          className={cn(
                            'inline-block text-[8px] font-bold px-1.5 py-0.5 rounded-md border',
                            config.badge
                          )}
                        >
                          {config.label.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Pedido de Emergência */}
      <PedidoModal
        open={showPedidoModal}
        onClose={() => setShowPedidoModal(false)}
        hospital={user}
        stock={stock}
        onSuccess={(total) => {
          setShowPedidoModal(false);
          showToast(
            total > 0
              ? `Pedido enviado! ${total} doador${total !== 1 ? 'es' : ''} notificado${total !== 1 ? 's' : ''}.`
              : 'Pedido registado. Nenhum doador compatível encontrado no momento.',
            'success'
          );
        }}
        onError={() =>
          showToast('Erro ao enviar o pedido. Tente novamente.', 'error')
        }
      />

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeUp { animation: fadeUp 0.45s ease both; }
      `}</style>
    </div>
  );
};

// ── Modal de Pedido de Emergência ─────────────────────────────────────────────

interface PedidoModalProps {
  open: boolean;
  onClose: () => void;
  hospital: import('@/types/hospital').HospitalUser | null;
  stock: StockItem[];
  onSuccess: (totalNotificados: number) => void;
  onError: () => void;
}

const PedidoModal: React.FC<PedidoModalProps> = ({
  open,
  onClose,
  hospital,
  stock,
  onSuccess,
  onError,
}) => {
  const { mutateAsync: criarPedido, isPending } = useMutation({
    mutationFn: async (payload: object): Promise<PedidoResponse> => {
      const { data } = await api.post<PedidoResponse>('/pedido', payload);
      return data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PedidoForm>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      nivel_urgencia: 'urgente',
      quantidade_necessaria: 1,
    },
  });

  const onSubmit = async (data: PedidoForm) => {
    if (!hospital) return;
    try {
      const response = await criarPedido({
        id_hospital: hospital.id_hospital,
        tipo_sanguineo_necessario: data.tipo_sanguineo_necessario,
        quantidade_necessaria: data.quantidade_necessaria ?? 1,
        id_municipio_pedido: hospital.id_municipio,
        contacto_referencia: data.contacto_referencia,
        nivel_urgencia: data.nivel_urgencia,
        mensagem_adicional: data.mensagem_adicional ?? '',
      });
      reset();
      onSuccess(response.total_notificados);
    } catch {
      onError();
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              {/* Header do modal */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-black text-slate-900 dark:text-white text-lg flex items-center gap-2">
                    <MdPriorityHigh className="text-red-600" /> Pedido de
                    Emergência
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Os doadores compatíveis serão notificados imediatamente.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <MdClose />
                </button>
              </div>

              {/* Formulário */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 space-y-4"
                noValidate
              >
                {/* Tipo sanguíneo */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="tipo_sanguineo"
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-500"
                  >
                    <MdBloodtype /> Tipo Sanguíneo Necessário
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.keys(TIPO_LABEL) as TipoSanguineo[]).map(
                      (tipo) => {
                        const inStock = stock.find(
                          (s) => s.tipo_sanguineo === tipo
                        );
                        return (
                          <label key={tipo} className="cursor-pointer">
                            <input
                              {...register('tipo_sanguineo_necessario')}
                              type="radio"
                              value={tipo}
                              className="sr-only peer"
                            />
                            <div
                              className={cn(
                                'h-12 rounded-xl flex flex-col items-center justify-center text-sm font-black border-2 transition-all',
                                'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400',
                                'peer-checked:border-red-600 peer-checked:bg-red-600 peer-checked:text-white',
                                'hover:border-red-300 dark:hover:border-red-800'
                              )}
                            >
                              {TIPO_LABEL[tipo]}
                              {inStock && (
                                <span className="text-[8px] font-bold opacity-70 leading-none">
                                  {inStock.quantidade_bolsas}un
                                </span>
                              )}
                            </div>
                          </label>
                        );
                      }
                    )}
                  </div>
                  {errors.tipo_sanguineo_necessario && (
                    <p className="text-red-500 text-xs font-semibold">
                      Seleccione o tipo sanguíneo.
                    </p>
                  )}
                </div>

                {/* Nível de urgência */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase tracking-widest text-slate-500">
                    Nível de Urgência
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['urgente', 'emergencia'] as NivelUrgencia[]).map(
                      (nivel) => (
                        <label key={nivel} className="cursor-pointer">
                          <input
                            {...register('nivel_urgencia')}
                            type="radio"
                            value={nivel}
                            className="sr-only peer"
                          />
                          <div
                            className={cn(
                              'h-11 rounded-xl flex items-center justify-center text-sm font-black border-2 capitalize transition-all',
                              nivel === 'urgente'
                                ? 'border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 peer-checked:bg-amber-500 peer-checked:border-amber-500 peer-checked:text-white'
                                : 'border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 peer-checked:bg-red-600 peer-checked:border-red-600 peer-checked:text-white'
                            )}
                          >
                            {nivel === 'urgente'
                              ? '⚠ Urgente'
                              : '🚨 Emergência'}
                          </div>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Quantidade */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="quantidade"
                    className="text-xs font-black uppercase tracking-widest text-slate-500"
                  >
                    Quantidade Necessária (bolsas)
                  </Label>
                  <Input
                    {...register('quantidade_necessaria')}
                    id="quantidade"
                    type="number"
                    min={1}
                    placeholder="Ex: 2"
                    className={cn(
                      'rounded-xl',
                      errors.quantidade_necessaria && 'border-red-400'
                    )}
                  />
                  {errors.quantidade_necessaria && (
                    <p className="text-red-500 text-xs font-semibold">
                      {errors.quantidade_necessaria.message}
                    </p>
                  )}
                </div>

                {/* Contacto */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contacto"
                    className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-500"
                  >
                    <MdPhone /> Contacto de Referência
                  </Label>
                  <Input
                    {...register('contacto_referencia')}
                    id="contacto"
                    type="tel"
                    placeholder="Ex: 923000000"
                    defaultValue={hospital?.telefone ?? ''}
                    className={cn(
                      'rounded-xl',
                      errors.contacto_referencia && 'border-red-400'
                    )}
                  />
                  {errors.contacto_referencia && (
                    <p className="text-red-500 text-xs font-semibold">
                      {errors.contacto_referencia.message}
                    </p>
                  )}
                </div>

                {/* Mensagem adicional */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="mensagem"
                    className="text-xs font-black uppercase tracking-widest text-slate-500"
                  >
                    Mensagem Adicional{' '}
                    <span className="font-normal normal-case text-slate-400">
                      (opcional)
                    </span>
                  </Label>
                  <textarea
                    {...register('mensagem_adicional')}
                    id="mensagem"
                    rows={3}
                    placeholder="Informações relevantes para os doadores..."
                    className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-red-400/60 transition-colors resize-none"
                  />
                </div>

                {/* Info do hospital (read-only) */}
                {hospital && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                    <div className="size-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-black">
                        {hospital.nome.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                        {hospital.nome}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {hospital.endereco}
                      </p>
                    </div>
                  </div>
                )}

                {/* Botões */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 rounded-xl"
                    onClick={handleClose}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20"
                    disabled={isPending}
                    aria-busy={isPending}
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <LoadingDots /> A enviar...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <MdPriorityHigh /> Enviar Pedido
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ── Sub-componentes ───────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  subValue: string;
  accent: 'primary' | 'blue' | 'slate';
  pulse?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  accent,
  pulse,
}) => (
  <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-xl bg-white dark:bg-slate-900 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default">
    <CardContent className="p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-snug">
          {label}
        </p>
        <span
          className={cn(
            'size-2 rounded-full shrink-0 mt-0.5',
            accent === 'primary'
              ? 'bg-red-500'
              : accent === 'blue'
                ? 'bg-blue-500'
                : 'bg-slate-400',
            pulse && 'animate-pulse'
          )}
        />
      </div>
      <p
        className={cn(
          'text-3xl font-black tracking-tighter',
          accent === 'primary'
            ? 'text-red-600 dark:text-red-400'
            : accent === 'blue'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-900 dark:text-white'
        )}
      >
        {value}
      </p>
      {subValue && (
        <p className="text-[10px] font-medium text-slate-400 mt-1">
          {subValue}
        </p>
      )}
    </CardContent>
  </Card>
);

const LoadingDots: React.FC = () => (
  <span className="flex items-center gap-0.5 mr-0.5">
    {[0, 150, 300].map((d) => (
      <span
        key={d}
        className="w-1 h-1 rounded-full bg-current animate-bounce"
        style={{ animationDelay: `${d}ms` }}
      />
    ))}
  </span>
);
