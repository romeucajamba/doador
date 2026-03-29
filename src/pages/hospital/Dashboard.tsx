import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  MdEvent,
  MdGroup,
  MdAdd,
  MdAnalytics,
  MdBloodtype,
  MdLocalShipping,
  MdPriorityHigh,
  MdCheckCircle,
  MdFileDownload,
  MdClose,
} from 'react-icons/md';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useInventoryStore } from '@/stores/useInventoryStore';
import { BloodType } from '@/lib/types';
import { cn } from '@/lib/utils';

type StockStatus = 'critical' | 'low' | 'stable';
type TagColor = 'green' | 'blue' | 'red';
type ToastType = 'success' | 'error';

interface MetricCardProps {
  label: string;
  value: string;
  subValue: string;
  accent: 'primary' | 'blue' | 'slate';
  pulse?: boolean;
}

interface ActionBtnProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
  tag: string;
  tagColor: TagColor;
}

interface Toast {
  message: string;
  type: ToastType;
}

const getStockStatus = (units: number): StockStatus => {
  if (units < 20) return 'critical';
  if (units < 40) return 'low';
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

export const HospitalDashboard: React.FC = () => {
  const stock = useInventoryStore((state) => state.stock);
  const [isRequesting, setIsRequesting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [barWidths, setBarWidths] = useState<Record<string, number>>({});

  // Animate bars on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const widths: Record<string, number> = {};
      (Object.entries(stock) as [BloodType, number][]).forEach(
        ([type, units]) => {
          widths[type] = Math.min(units, 100);
        }
      );
      setBarWidths(widths);
    }, 300);
    return () => clearTimeout(timer);
  }, [stock]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
    },
    []
  );

  const handleEmergencyRequest = useCallback(() => {
    if (isRequesting) return;
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      showToast(
        'Pedido de emergência enviado a todos os doadores compatíveis!'
      );
    }, 2000);
  }, [isRequesting, showToast]);

  const handleExport = useCallback(() => {
    showToast('Relatório exportado com sucesso!');
  }, [showToast]);

  return (
    <div className="space-y-5 max-w-6xl mx-auto px-0 sm:px-2 animate-fadeUp">
      {/* Toast */}
      {toast && (
        <div
          className={cn(
            'fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold animate-slideDown max-w-xs',
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
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Hospital Command Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
            Telemetria em tempo real e gestão de doadores.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            onClick={handleEmergencyRequest}
            disabled={isRequesting}
            className="h-9 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30 transition-all gap-1.5"
          >
            {isRequesting ? (
              <>
                <LoadingDots /> A processar...
              </>
            ) : (
              <>
                <MdAdd className="text-base" /> Pedido de Emergência
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard
          label="Unidades em Stock"
          value="450"
          subValue="+12% esta semana"
          accent="blue"
        />
        <MetricCard
          label="Cross-matches Urgentes"
          value="2"
          subValue="Ação imediata"
          accent="primary"
          pulse
        />
        <MetricCard
          label="Verificações Pendentes"
          value="15"
          subValue="A aguardar revisão"
          accent="slate"
        />
        <MetricCard
          label="Campanhas Ativas"
          value="3"
          subValue="A decorrer em Luanda"
          accent="blue"
        />
      </div>

      {/* Blood stock */}
      <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-black text-slate-900 dark:text-white">
              Níveis de Stock de Sangue
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Inventário em tempo real por tipo.
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {(Object.entries(stock) as [BloodType, number][]).map(
              ([type, units]) => {
                const status = getStockStatus(units);
                const config = STATUS_CONFIG[status];
                return (
                  <div
                    key={type}
                    className="flex flex-col items-center gap-2 group cursor-default"
                  >
                    <div className="w-full space-y-1.5">
                      {/* Vertical bar */}
                      <div className="relative h-20 w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex items-end">
                        <div
                          className={cn(
                            'w-full rounded-xl transition-all duration-1000 ease-out',
                            config.bar
                          )}
                          style={{ height: `${barWidths[type] ?? 0}%` }}
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
                          {type}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          {units} un.
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
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-6">
        <div className="space-y-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <ActionBtn
              icon={<MdEvent />}
              label="Agendar"
              onClick={() => showToast('Abrindo agenda...')}
            />
            <ActionBtn
              icon={<MdGroup />}
              label="Doadores"
              onClick={() => showToast('Carregando doadores...')}
            />
            <ActionBtn
              icon={<MdAnalytics />}
              label="Relatórios"
              onClick={() => showToast('Gerando relatório...')}
            />
            <ActionBtn
              icon={<MdLocalShipping />}
              label="Transferências"
              onClick={() => showToast('Abrindo transferências...')}
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
            Atividade Recente
          </h3>
          <div className="space-y-2">
            <ActivityItem
              icon={<MdBloodtype className="text-emerald-500" />}
              title="Nova Doação Recebida"
              desc="Doador: João Silva (A+)"
              time="10:30"
              tag="+2 Un."
              tagColor="green"
            />
            <ActivityItem
              icon={<MdLocalShipping className="text-blue-500" />}
              title="Transferência Enviada"
              desc="Para: Hospital Central (O-)"
              time="Ontem 16:15"
              tag="-10 Un."
              tagColor="blue"
            />
            <ActivityItem
              icon={<MdPriorityHigh className="text-red-500" />}
              title="Alerta Urgente"
              desc="Stock de AB+ em nível crítico"
              time="Ontem 09:00"
              tag="Crítico"
              tagColor="red"
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeUp { animation: fadeUp 0.45s ease both; }
        .animate-slideDown { animation: slideDown 0.3s ease both; }
      `}</style>
    </div>
  );
};

/* ─── Sub-components ─────────────────────────────────────────── */

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

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 group active:scale-95"
  >
    <span className="text-2xl text-blue-600 dark:text-blue-400 mb-1.5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-200">
      {icon}
    </span>
    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
      {label}
    </span>
  </button>
);

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon,
  title,
  desc,
  time,
  tag,
  tagColor,
}) => (
  <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
    <div className="size-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/30 transition-colors">
      <span className="text-lg">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
        {title}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
        {desc} · {time}
      </p>
    </div>
    <span
      className={cn(
        'text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shrink-0',
        tagColor === 'green'
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
          : tagColor === 'blue'
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
            : 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
      )}
    >
      {tag}
    </span>
  </div>
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
