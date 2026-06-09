import * as React from 'react';
import { useForm } from 'react-hook-form';
import {
  MdClose,
  MdCalendarMonth,
  MdAccessTime,
  MdCheckCircle,
} from 'react-icons/md';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Hospital } from '@/types/hospital';
import { CreateAgendaInput } from '@/types/hospital';
import { useCreateAgenda } from '@/service/hospital/appointments';
import { useAuthStore } from '@/hooks/auth';

interface BookingModalProps {
  hospital: Hospital;
  onClose: () => void;
  onConfirm: () => void;
}

type FormValues = {
  data_agendada: string;
  hora_agendada: string;
  observacao_doador: string;
};

export const BookingModal: React.FC<BookingModalProps> = ({
  hospital,
  onClose,
  onConfirm,
}) => {
  const { session, updateUser } = useAuthStore();
  const user = session?.user;
  const { mutate, isPending, isError, error } = useCreateAgenda();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      data_agendada: '',
      hora_agendada: '',
      observacao_doador: '',
    },
  });

  // Data mínima = hoje
  const today = new Date().toISOString().split('T')[0];

  const onSubmit = (values: FormValues) => {
    if (!user?.id_doador) return;

    console.log(values.hora_agendada);

    const payload: CreateAgendaInput = {
      id_doador: user.id_doador,
      id_hospital: hospital.id_hospital,
      data_agendada: values.data_agendada,
      hora_agendada: values.hora_agendada,
      observacao_doador: values.observacao_doador || undefined,
    };

    mutate(payload, {
      onSuccess: () => {
        onConfirm(); // fecha o modal e actualiza o card
      },
    });
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fadeUp">
        {/* Barra superior colorida */}
        <div className="h-1 w-full bg-primary" />

        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-4">
          <div className="space-y-0.5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Agendar Doação
            </p>
            <h2
              id="booking-modal-title"
              className="text-base font-bold text-slate-900 dark:text-white line-clamp-1"
            >
              {hospital.nome}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {hospital.endereco}
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 mt-0.5"
            aria-label="Fechar"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-5 pb-5 space-y-4">
          {/* Data */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 block">
              Data da Doação
            </label>
            <div className="relative group">
              <MdCalendarMonth className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
              <input
                {...register('data_agendada', {
                  required: 'Seleccione uma data',
                })}
                type="date"
                min={today}
                className={cn(
                  'w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium text-slate-900 dark:text-white text-sm',
                  errors.data_agendada
                    ? 'border-red-200 dark:border-red-900/50 focus:border-red-500'
                    : 'border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900'
                )}
              />
            </div>
            {errors.data_agendada && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-wide ml-1">
                {errors.data_agendada.message}
              </p>
            )}
          </div>

          {/* Hora */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 block">
              Hora Preferida
            </label>
            <div className="relative group">
              <MdAccessTime className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
              <input
                {...register('hora_agendada', {
                  required: 'Seleccione uma hora',
                })}
                type="time"
                className={cn(
                  'w-full bg-slate-50 dark:bg-slate-800 border-2 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium text-slate-900 dark:text-white text-sm',
                  errors.hora_agendada
                    ? 'border-red-200 dark:border-red-900/50 focus:border-red-500'
                    : 'border-transparent focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900'
                )}
              />
            </div>
            {errors.hora_agendada && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-wide ml-1">
                {errors.hora_agendada.message}
              </p>
            )}
          </div>

          {/* Observação */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1 block">
              Observação{' '}
              <span className="font-medium normal-case tracking-normal">
                (opcional)
              </span>
            </label>
            <textarea
              {...register('observacao_doador')}
              rows={3}
              placeholder="Ex: Prefiro atendimento rápido, tenho disponibilidade apenas de manhã..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl py-3 px-4 outline-none transition-all font-medium text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:border-primary/30 focus:bg-white dark:focus:bg-slate-900 resize-none"
            />
          </div>

          {/* Erro do servidor */}
          {isError && (
            <div
              role="alert"
              className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <span className="text-red-500 text-xs font-bold mt-0.5">⚠</span>
              <p className="text-red-600 dark:text-red-400 text-xs font-semibold">
                {(error as any)?.response?.data?.message ??
                  'Erro ao agendar. Tente novamente.'}
              </p>
            </div>
          )}

          {/* Acções */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-2xl h-11 font-bold text-sm border-slate-200 dark:border-slate-700"
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-2xl h-11 font-bold text-sm gap-2 shadow-lg shadow-primary/20"
              disabled={isPending}
              aria-busy={isPending}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner />A enviar...
                </span>
              ) : (
                <>
                  <MdCheckCircle className="text-base" />
                  Confirmar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
  <svg
    className="animate-spin h-4 w-4 text-current"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);
