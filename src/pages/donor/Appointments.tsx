import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  MdCalendarMonth,
  MdLocationOn,
  MdAccessTime,
  MdCheckCircle,
  MdFileDownload,
  MdInfo,
  MdCancel,
  MdEditCalendar,
  MdClose,
} from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import { Appointment } from '@/lib/types';
import { cn } from '@/lib/utils';

type AppointmentStatus = 'completed' | 'pending' | 'cancelled';

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; bar: string; badge: string }
> = {
  completed: {
    label: 'Concluído',
    bar: 'bg-emerald-500',
    badge:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  },
  pending: {
    label: 'Pendente',
    bar: 'bg-amber-400',
    badge:
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  },
  cancelled: {
    label: 'Cancelado',
    bar: 'bg-slate-300 dark:bg-slate-600',
    badge:
      'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
  },
};

const PRIOR_INSTRUCTIONS = [
  'Estar bem alimentado antes da doação',
  'Ter dormido pelo menos 6 horas',
  'Apresentar documento original com foto',
  'Beber bastante água nas horas anteriores',
];

export const Appointments: React.FC = () => {
  const appointments = useAppointmentStore((state) => state.appointments);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadedIds, setDownloadedIds] = useState<Set<string>>(new Set());
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' = 'success') => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
    },
    []
  );

  const handleDownload = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (downloadedIds.has(id)) return;
      setDownloadingId(id);
      setTimeout(() => {
        setDownloadingId(null);
        setDownloadedIds((prev) => new Set(prev).add(id));
        showToast('Comprovativo gerado com sucesso!');
      }, 1500);
    },
    [downloadedIds, showToast]
  );

  const handleCancel = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setCancellingId(id);
      setTimeout(() => {
        setCancellingId(null);
        showToast('Agendamento cancelado.', 'info');
      }, 1200);
    },
    [showToast]
  );

  const handleReschedule = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setRescheduleId(id);
      setTimeout(() => {
        setRescheduleId(null);
        showToast('Pedido de reagendamento enviado!');
      }, 1200);
    },
    [showToast]
  );

  const closeModal = useCallback(() => setSelectedAppointment(null), []);

  const isValidStatus = (status: string): status is AppointmentStatus =>
    ['completed', 'pending', 'cancelled'].includes(status);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-0 sm:px-2 animate-fadeUp">
      {/* Toast */}
      {toast && (
        <div
          className={cn(
            'fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold animate-slideDown',
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-700 text-white'
          )}
        >
          <MdCheckCircle className="text-lg shrink-0" />
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Meus Agendamentos
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">
            Gerencie seus donativos passados e futuros
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
        {appointments.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <MdCalendarMonth className="text-5xl text-slate-200 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold text-sm">
              Nenhum agendamento encontrado.
            </p>
          </div>
        ) : (
          appointments.map((apt, index) => {
            const status = isValidStatus(apt.status) ? apt.status : 'pending';
            const config = STATUS_CONFIG[status];

            return (
              <Card
                key={apt.id}
                className="border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md overflow-hidden group cursor-pointer rounded-2xl bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-0.5"
                style={{ animationDelay: `${index * 60}ms` }}
                onClick={() => setSelectedAppointment(apt)}
              >
                <CardContent className="p-0">
                  {/* Status bar */}
                  <div className={cn('h-1 w-full', config.bar)} />

                  <div className="p-5 space-y-4">
                    {/* Header row */}
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                          {apt.hospitalName}
                        </h3>
                        <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                          <MdAccessTime className="text-sm shrink-0" />
                          {apt.date} · {apt.time}
                        </p>
                      </div>
                      <Badge
                        className={cn(
                          'rounded-lg px-2.5 py-1 font-bold text-[10px] tracking-wide border shrink-0',
                          config.badge
                        )}
                      >
                        {config.label}
                      </Badge>
                    </div>

                    {/* Donation type */}
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                      <div className="size-9 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-600 shrink-0">
                        <span className="text-primary font-black text-xs">
                          O+
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                          Tipo de Doação
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white uppercase truncate">
                          {apt.type}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 h-9 rounded-xl font-semibold text-xs gap-1.5 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(apt);
                          }}
                        >
                          <MdInfo className="text-sm text-primary" /> Detalhes
                        </Button>
                      </div>

                      {status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 h-9 rounded-xl text-red-500 border-red-100 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950 font-semibold text-xs gap-1.5 transition-all"
                            onClick={(e) => handleCancel(apt.id, e)}
                            disabled={cancellingId === apt.id}
                          >
                            {cancellingId === apt.id ? (
                              <LoadingDots />
                            ) : (
                              <>
                                <MdCancel className="text-sm" /> Cancelar
                              </>
                            )}
                          </Button>
                          <Button
                            className="flex-1 h-9 rounded-xl font-semibold text-xs bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all gap-1.5"
                            onClick={(e) => handleReschedule(apt.id, e)}
                            disabled={rescheduleId === apt.id}
                          >
                            {rescheduleId === apt.id ? (
                              <LoadingDots />
                            ) : (
                              <>
                                <MdEditCalendar className="text-sm" /> Reagendar
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal */}
      {selectedAppointment &&
        (() => {
          const status = isValidStatus(selectedAppointment.status)
            ? selectedAppointment.status
            : 'pending';
          const config = STATUS_CONFIG[status];
          return (
            <>
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
                onClick={closeModal}
              />
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-scaleIn border border-slate-100 dark:border-slate-800">
                {/* Modal header */}
                <div className="relative p-6 bg-primary text-white overflow-hidden">
                  <div className="absolute -top-4 -right-4 opacity-[0.08]">
                    <MdCalendarMonth className="text-[8rem]" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                        Código #
                        {selectedAppointment.id.substring(0, 8).toUpperCase()}
                      </p>
                      <h2 className="text-xl font-black leading-tight">
                        {selectedAppointment.hospitalName}
                      </h2>
                    </div>
                    <button
                      onClick={closeModal}
                      className="size-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
                      aria-label="Fechar"
                    >
                      <MdClose className="text-lg" />
                    </button>
                  </div>
                  <div className="mt-3">
                    <Badge
                      className={cn(
                        'text-[10px] font-bold tracking-wide border px-2.5 py-1 rounded-lg',
                        config.badge
                      )}
                    >
                      {config.label}
                    </Badge>
                  </div>
                </div>

                <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
                  {/* Date / Time */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        icon: <MdCalendarMonth className="text-blue-500" />,
                        label: 'Data',
                        value: selectedAppointment.date,
                        bg: 'bg-blue-50 dark:bg-blue-950',
                      },
                      {
                        icon: <MdAccessTime className="text-emerald-500" />,
                        label: 'Horário',
                        value: selectedAppointment.time,
                        bg: 'bg-emerald-50 dark:bg-emerald-950',
                      },
                    ].map(({ icon, label, value, bg }) => (
                      <div
                        key={label}
                        className={cn(
                          'flex items-center gap-3 p-3.5 rounded-xl',
                          bg
                        )}
                      >
                        <span className="text-xl shrink-0">{icon}</span>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            {label}
                          </p>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl shrink-0">
                      <MdLocationOn />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Localização
                      </p>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {selectedAppointment.hospitalName}
                      </p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                      Instruções Prévias
                    </p>
                    <div className="space-y-2">
                      {PRIOR_INSTRUCTIONS.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-2.5 bg-white dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600"
                        >
                          <MdCheckCircle className="text-emerald-500 text-base shrink-0 mt-0.5" />
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-snug">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={closeModal}
                    className="w-full h-11 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </>
          );
        })()}

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes scaleIn { from { opacity:0; transform:translate(-50%,-50%) scale(0.95); } to { opacity:1; transform:translate(-50%,-50%) scale(1); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeUp { animation: fadeUp 0.5s ease both; }
        .animate-fadeIn { animation: fadeIn 0.25s ease both; }
        .animate-scaleIn { animation: scaleIn 0.25s ease both; }
        .animate-slideDown { animation: slideDown 0.3s ease both; }
      `}</style>
    </div>
  );
};

const LoadingDots: React.FC = () => (
  <span className="flex items-center gap-0.5">
    {[0, 150, 300].map((delay) => (
      <span
        key={delay}
        className="w-1 h-1 rounded-full bg-current animate-bounce"
        style={{ animationDelay: `${delay}ms` }}
      />
    ))}
  </span>
);
