import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  MdBloodtype,
  MdFavorite,
  MdHistory,
  MdVerified,
  MdCheckCircle,
  MdArrowForward,
} from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/stores/useAuthStore';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import { Donor } from '@/lib/types';
import { cn } from '@/lib/utils';

type ImpactCardProps = {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: string;
  delay?: number;
};

const IMPACT_STATS = (user: Donor | null) => [
  {
    icon: <MdBloodtype className="text-primary text-xl" />,
    value: String(user?.totalDonations ?? 12),
    label: 'Doações',
    accent: 'bg-primary/10 dark:bg-primary/20',
  },
  {
    icon: <MdFavorite className="text-rose-500 text-xl" />,
    value: String(user?.livesSaved ?? 36),
    label: 'Vidas Salvas',
    accent: 'bg-rose-50 dark:bg-rose-950/50',
  },
  {
    icon: <span className="text-lg leading-none">🏥</span>,
    value: '3',
    label: 'Centros',
    accent: 'bg-slate-100 dark:bg-slate-800',
  },
  {
    icon: <span className="text-lg leading-none">⭐</span>,
    value: '450',
    label: 'Pontos',
    accent: 'bg-amber-50 dark:bg-amber-950/50',
  },
];

const RANK_PROGRESS = 45;

export const DonorDashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user) as Donor | null;
  const appointments = useAppointmentStore((state) => state.appointments);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgressWidth(RANK_PROGRESS), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSchedule = () => {
    if (isScheduling) return;
    setIsScheduling(true);
    setTimeout(() => {
      setIsScheduling(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4500);
    }, 1800);
  };

  const firstName = user?.name?.split(' ')[0] ?? 'Doador';

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-0 sm:px-2 animate-fadeUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">
            Bem-vindo de volta
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {firstName} 👋
          </h1>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="size-9 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-black text-sm">
              {user?.bloodType ?? 'O+'}
            </span>
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 dark:text-white">
              {user?.rank ?? 'Bronze'} Donor
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Nível atual
            </p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Eligibility card */}
        <Card className="lg:col-span-2 border border-emerald-100 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900 overflow-hidden shadow-sm relative rounded-2xl">
          {/* Success overlay */}
          {showSuccess && (
            <div className="absolute inset-0 bg-emerald-600/95 z-20 flex flex-col items-center justify-center text-white p-8 text-center animate-fadeIn rounded-2xl">
              <div className="size-16 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <MdCheckCircle className="text-4xl" />
              </div>
              <h3 className="text-2xl font-black mb-2">Agendado!</h3>
              <p className="text-sm font-medium opacity-90 max-w-xs">
                Sua doação foi pré-agendada. Verifique seus agendamentos para
                mais detalhes.
              </p>
            </div>
          )}

          <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full min-h-[180px]">
            <div className="flex items-start gap-3 mb-5">
              <div className="size-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm flex items-center justify-center shrink-0">
                <MdVerified className="text-emerald-500 text-xl" />
              </div>
              <div>
                <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                  Elegível para doar
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-0.5">
                  O seu sangue{' '}
                  <strong className="font-black text-primary">
                    {user?.bloodType ?? 'O+'}
                  </strong>{' '}
                  está em alta demanda em Luanda. Pode salvar até 3 vidas.
                </p>
              </div>
            </div>

            <Button
              onClick={handleSchedule}
              disabled={isScheduling}
              className="w-full sm:w-auto px-6 py-5 sm:py-4 bg-primary font-bold text-sm rounded-xl shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isScheduling ? (
                <>
                  <SchedulingDots /> A agendar...
                </>
              ) : (
                <>
                  Agendar Doação <MdArrowForward className="text-base" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Rank card */}
        <Card className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900">
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-0.5">
                  Classificação
                </p>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {user?.rank ?? 'Bronze'}
                </p>
              </div>
              <div className="size-12 bg-amber-50 dark:bg-amber-950/50 rounded-xl flex items-center justify-center text-2xl">
                🏆
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">
                  Progresso
                </span>
                <span className="text-primary">{RANK_PROGRESS}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              3 doações para alcançar o nível{' '}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Prata
              </span>
              . Continue assim!
            </p>

            {/* Rank steps */}
            <div className="flex items-center gap-1 pt-1">
              {['Bronze', 'Prata', 'Ouro', 'Elite'].map((rank, i) => (
                <React.Fragment key={rank}>
                  <div
                    className={cn(
                      'flex-1 h-1.5 rounded-full transition-all duration-500',
                      i === 0 ? 'bg-primary' : 'bg-slate-100 dark:bg-slate-800'
                    )}
                  />
                  {i < 3 && <div className="w-1" />}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between">
              {['Bronze', 'Prata', 'Ouro', 'Elite'].map((rank, i) => (
                <span
                  key={rank}
                  className={cn(
                    'text-[9px] font-bold',
                    i === 0
                      ? 'text-primary'
                      : 'text-slate-400 dark:text-slate-600'
                  )}
                >
                  {rank}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact stats */}
      <section>
        <h2 className="text-base font-black text-slate-900 dark:text-white mb-3 tracking-tight">
          Seu Impacto
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {IMPACT_STATS(user).map(({ icon, value, label, accent }, i) => (
            <ImpactCard
              key={label}
              icon={icon}
              value={value}
              label={label}
              accent={accent}
              delay={i * 80}
            />
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="pb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Atividade Recente
          </h2>
          <Button
            variant="ghost"
            className="text-primary font-semibold text-xs h-8 px-3 hover:bg-primary/5 rounded-lg"
          >
            Ver tudo
          </Button>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <MdHistory className="text-4xl text-slate-200 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-slate-400 text-sm font-medium">
              Nenhuma atividade recente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {appointments.slice(0, 6).map((apt, i) => (
              <Card
                key={apt.id}
                className="border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group rounded-xl bg-white dark:bg-slate-900"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-200">
                      <MdHistory className="text-lg text-primary group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {apt.hospitalName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                        {apt.date} · {apt.type}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        'text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-lg border shrink-0',
                        apt.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                          : apt.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      )}
                    >
                      {apt.status === 'completed'
                        ? 'Feito'
                        : apt.status === 'pending'
                          ? 'Pendente'
                          : 'Cancelado'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .animate-fadeUp { animation: fadeUp 0.45s ease both; }
        .animate-fadeIn { animation: fadeIn 0.3s ease both; }
      `}</style>
    </div>
  );
};

const ImpactCard: React.FC<ImpactCardProps> = ({
  icon,
  value,
  label,
  accent,
  delay = 0,
}) => (
  <Card
    className="border border-slate-100 dark:border-slate-800 shadow-sm rounded-xl bg-white dark:bg-slate-900 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
    style={{ animationDelay: `${delay}ms` }}
  >
    <CardContent className="p-4 space-y-2">
      <div
        className={cn(
          'size-9 rounded-xl flex items-center justify-center',
          accent
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-xl font-black text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          {label}
        </p>
      </div>
    </CardContent>
  </Card>
);

const SchedulingDots: React.FC = () => (
  <span className="flex items-center gap-0.5 mr-1">
    {[0, 150, 300].map((d) => (
      <span
        key={d}
        className="w-1 h-1 rounded-full bg-white animate-bounce"
        style={{ animationDelay: `${d}ms` }}
      />
    ))}
  </span>
);
