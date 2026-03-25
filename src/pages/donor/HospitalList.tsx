import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import {
  MdSearch,
  MdLocationOn,
  MdCall,
  MdInfo,
  MdCalendarMonth,
  MdClose,
  MdCheckCircle,
} from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/stores/useNotificationStore';

interface Hospital {
  id: string;
  name: string;
  address: string;
  distance: string;
  status: string;
  type: HospitalType;
  phone: string;
}

type HospitalType = 'Public Hospital' | 'Private Clinic' | 'Blood Center';
type ActionState = `contact-${string}` | `book-${string}` | null;
type ToastState = { message: string; hospitalName: string } | null;

const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    name: 'Hospital Josina Machel',
    address: 'Rua Neves Freire, Luanda',
    distance: '1.2 km',
    status: 'Urgente O- necessário',
    type: 'Public Hospital',
    phone: '+244 923 111 222',
  },
  {
    id: 'h2',
    name: 'Clínica Girassol',
    address: 'Rua Comandante Gika, Luanda',
    distance: '3.5 km',
    status: 'Aceita todos os tipos',
    type: 'Private Clinic',
    phone: '+244 923 333 444',
  },
  {
    id: 'h3',
    name: 'Centro de Hemoterapia de Luanda',
    address: 'Avenida Deolinda Rodrigues',
    distance: '4.8 km',
    status: 'Campanha Hoje',
    type: 'Blood Center',
    phone: '+244 923 555 666',
  },
];

const TYPE_LABELS: Record<HospitalType, string> = {
  'Public Hospital': 'Hospital Público',
  'Private Clinic': 'Clínica Privada',
  'Blood Center': 'Centro de Sangue',
};

const isUrgent = (status: string) =>
  status.toLowerCase().includes('urgente') ||
  status.toLowerCase().includes('urgent');

export const HospitalList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeAction, setActiveAction] = useState<ActionState>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const filtered = useMemo(
    () =>
      MOCK_HOSPITALS.filter(
        (h) =>
          h.name.toLowerCase().includes(search.toLowerCase()) ||
          h.address.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const showToast = useCallback((message: string, hospitalName: string) => {
    setToast({ message, hospitalName });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleContact = useCallback(
    (hospital: Hospital) => {
      const key: ActionState = `contact-${hospital.id}`;
      if (activeAction === key) return;
      setActiveAction(key);
      setTimeout(() => {
        setActiveAction(null);
        showToast(`A ligar para ${hospital.name}...`, hospital.name);
      }, 1000);
    },
    [activeAction, showToast]
  );

  const handleBook = useCallback(
    (hospital: Hospital) => {
      const key: ActionState = `book-${hospital.id}`;
      if (activeAction === key || bookedIds.has(hospital.id)) return;
      setActiveAction(key);
      setTimeout(() => {
        setActiveAction(null);
        setBookedIds((prev) => new Set(prev).add(hospital.id));
        addNotification({
          title: 'Pedido de Agendamento',
          message: `Interesse enviado para ${hospital.name}. Eles confirmarão em breve.`,
          type: 'success',
        });
        showToast('Pedido de agendamento enviado!', hospital.name);
      }, 1500);
    },
    [activeAction, bookedIds, addNotification, showToast]
  );

  return (
    <div className="space-y-5 max-w-6xl mx-auto px-0 sm:px-2 animate-fadeUp">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-600 text-white shadow-xl text-sm font-semibold animate-slideDown max-w-xs">
          <MdCheckCircle className="text-lg shrink-0" />
          <span className="flex-1 min-w-0">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-white/70 hover:text-white shrink-0"
            aria-label="Fechar"
          >
            <MdClose className="text-base" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Centros de Doação
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-widest mt-1">
            Encontre o lugar mais próximo para salvar vidas
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            className="rounded-xl h-10 px-4 border-slate-200 dark:border-slate-700 font-semibold text-sm hidden sm:flex hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Mapa
          </Button>
          <Button className="rounded-xl h-10 px-4 font-bold text-sm bg-primary shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200">
            Emergências
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative group">
        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-slate-400 group-focus-within:text-primary transition-colors pointer-events-none" />
        <input
          type="search"
          placeholder="Pesquisar por nome ou rua..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
          aria-label="Pesquisar centros de doação"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Limpar pesquisa"
          >
            <MdClose className="text-sm" />
          </button>
        )}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para{' '}
          <span className="font-bold text-slate-700 dark:text-slate-300">
            "{search}"
          </span>
        </p>
      )}

      {/* Hospital grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
        {filtered.length === 0 ? (
          <EmptyState search={search} onClear={() => setSearch('')} />
        ) : (
          filtered.map((hospital, i) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              index={i}
              isContactLoading={activeAction === `contact-${hospital.id}`}
              isBookLoading={activeAction === `book-${hospital.id}`}
              isBooked={bookedIds.has(hospital.id)}
              onContact={() => handleContact(hospital)}
              onBook={() => handleBook(hospital)}
            />
          ))
        )}
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

interface HospitalCardProps {
  hospital: Hospital;
  index: number;
  isContactLoading: boolean;
  isBookLoading: boolean;
  isBooked: boolean;
  onContact: () => void;
  onBook: () => void;
}

const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  index,
  isContactLoading,
  isBookLoading,
  isBooked,
  onContact,
  onBook,
}) => {
  const urgent = isUrgent(hospital.status);

  return (
    <Card
      className="overflow-hidden group hover:shadow-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-2xl transition-all duration-300 hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <CardContent className="p-0">
        {/* Top accent */}
        <div
          className={cn(
            'h-0.5 w-full',
            urgent ? 'bg-primary' : 'bg-emerald-500'
          )}
        />

        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-lg text-[9px] tracking-wider uppercase border-0">
                {TYPE_LABELS[hospital.type]}
              </Badge>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                {hospital.name}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 dark:bg-primary/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 border border-primary/10">
              <MdLocationOn className="text-sm" /> {hospital.distance}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
            <MdLocationOn className="text-base text-blue-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{hospital.address}</span>
          </div>

          {/* Status */}
          <div
            className={cn(
              'px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 border',
              urgent
                ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/40'
                : 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/40'
            )}
          >
            {urgent && (
              <span className="size-2 rounded-full bg-red-500 animate-pulse shrink-0" />
            )}
            <p className="text-[10px] font-bold uppercase tracking-wide leading-tight">
              {hospital.status}
            </p>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
            <MdCall className="text-sm text-slate-400 shrink-0" />
            <span>{hospital.phone}</span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 dark:border-slate-700 font-semibold h-10 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs gap-1.5 transition-all active:scale-95"
              onClick={onContact}
              disabled={isContactLoading}
              aria-label={`Contactar ${hospital.name}`}
            >
              {isContactLoading ? (
                <LoadingDots />
              ) : (
                <>
                  <MdCall className="text-sm text-primary" /> Contactar
                </>
              )}
            </Button>

            <Button
              className={cn(
                'rounded-xl font-semibold h-10 text-xs gap-1.5 transition-all active:scale-95',
                isBooked
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-100 shadow-md shadow-slate-900/10'
              )}
              onClick={onBook}
              disabled={isBookLoading || isBooked}
              aria-label={`Agendar em ${hospital.name}`}
            >
              {isBookLoading ? (
                <LoadingDots />
              ) : isBooked ? (
                <>
                  <MdCheckCircle className="text-sm" /> Enviado
                </>
              ) : (
                <>
                  <MdCalendarMonth className="text-sm" /> Agendar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface EmptyStateProps {
  search: string;
  onClear: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ search, onClear }) => (
  <div className="py-14 text-center space-y-4 col-span-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
    <div className="size-16 bg-slate-50 dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-3xl">
      🏥
    </div>
    <div className="space-y-1">
      <p className="text-slate-900 dark:text-white font-bold text-base">
        Nenhum centro encontrado
      </p>
      <p className="text-slate-400 font-medium text-sm px-8 max-w-xs mx-auto">
        Não encontrámos resultados para{' '}
        <span className="font-semibold text-slate-600 dark:text-slate-300">
          "{search}"
        </span>
      </p>
    </div>
    <Button
      onClick={onClear}
      variant="outline"
      className="rounded-xl font-semibold text-xs h-9 px-4 border-slate-200 dark:border-slate-700"
    >
      Limpar pesquisa
    </Button>
  </div>
);

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
