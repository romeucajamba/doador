import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import {
  MdSearch,
  MdFilterList,
  MdEmail,
  MdPhone,
  MdChevronRight,
  MdCheckCircle,
  MdClose,
  MdPerson,
} from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BloodType } from '@/lib/types';
import { cn } from '@/lib/utils';

type DonorStatus = 'Ready' | 'Waiting';
type FilterStatus = 'all' | DonorStatus;
type ToastState = { message: string } | null;

interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: BloodType;
  lastDonated: string;
  status: DonorStatus;
}

const MOCK_DONORS: Donor[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '923 000 111',
    bloodType: 'A+',
    lastDonated: '2024-03-01',
    status: 'Ready',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '923 000 222',
    bloodType: 'O-',
    lastDonated: '2024-02-15',
    status: 'Waiting',
  },
  {
    id: '3',
    name: 'Pedro Antunes',
    email: 'pedro@example.com',
    phone: '923 000 333',
    bloodType: 'B+',
    lastDonated: '2024-01-10',
    status: 'Ready',
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@example.com',
    phone: '923 000 444',
    bloodType: 'AB-',
    lastDonated: '2024-03-12',
    status: 'Ready',
  },
  {
    id: '5',
    name: 'Carlos Mendes',
    email: 'carlos@example.com',
    phone: '923 000 555',
    bloodType: 'B-',
    lastDonated: '2024-03-08',
    status: 'Waiting',
  },
  {
    id: '6',
    name: 'Luísa Ferreira',
    email: 'luisa@example.com',
    phone: '923 000 666',
    bloodType: 'O+',
    lastDonated: '2024-03-15',
    status: 'Ready',
  },
];

const STATUS_FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'Ready', label: 'Disponíveis' },
  { value: 'Waiting', label: 'Em espera' },
];

const formatDate = (iso: string): string => {
  const d = new Date(iso);
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

export const DonorManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [contactedIds, setContactedIds] = useState<Set<string>>(new Set());
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = useCallback((message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const filtered = useMemo(
    () =>
      MOCK_DONORS.filter((d) => {
        const matchSearch =
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.bloodType.toLowerCase().includes(search.toLowerCase()) ||
          d.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || d.status === filterStatus;
        return matchSearch && matchStatus;
      }),
    [search, filterStatus]
  );

  const handleContact = useCallback(
    (donor: Donor) => {
      if (loadingId || contactedIds.has(donor.id)) return;
      setLoadingId(donor.id);
      setTimeout(() => {
        setLoadingId(null);
        setContactedIds((prev) => new Set(prev).add(donor.id));
        showToast(`Mensagem enviada para ${donor.name}.`);
      }, 1200);
    },
    [loadingId, contactedIds, showToast]
  );

  const handleBroadcast = useCallback(() => {
    setBroadcastLoading(true);
    setTimeout(() => {
      setBroadcastLoading(false);
      showToast('Alerta enviado a todos os doadores disponíveis!');
    }, 1800);
  }, [showToast]);

  const readyCount = MOCK_DONORS.filter((d) => d.status === 'Ready').length;

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
            Gerencie e contacte a sua base de doadores registados.
          </p>
        </div>
        <Button
          onClick={handleBroadcast}
          disabled={broadcastLoading}
          className="h-9 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30 transition-all gap-1.5 self-start sm:self-auto"
        >
          {broadcastLoading ? (
            <>
              <LoadingDots /> A enviar...
            </>
          ) : (
            <>
              <MdEmail className="text-sm" /> Enviar Alerta
            </>
          )}
        </Button>
      </div>

      {/* Summary pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <MdPerson className="text-sm text-slate-500" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {MOCK_DONORS.length} doadores
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
            {readyCount} disponíveis
          </span>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
          <input
            type="search"
            placeholder="Pesquisar por nome, e-mail ou tipo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-blue-300 dark:focus:border-blue-700 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Limpar"
            >
              <MdClose className="text-sm" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
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

      {/* Donor grid */}
      {filtered.length === 0 ? (
        <div className="py-14 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <MdPerson className="text-4xl text-slate-200 dark:text-slate-700 mx-auto mb-2" />
          <p className="text-slate-900 dark:text-white font-bold text-sm">
            Nenhum doador encontrado
          </p>
          <p className="text-slate-400 text-xs font-medium mt-1">
            Tente uma pesquisa diferente.
          </p>
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
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
          {filtered.map((donor, i) => {
            const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
            const isContacted = contactedIds.has(donor.id);
            const isLoading = loadingId === donor.id;

            return (
              <Card
                key={donor.id}
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
                        {getInitials(donor.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                          {donor.name}
                        </h3>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                          Doador desde 2023
                        </p>
                      </div>
                    </div>
                    <div className="size-11 bg-blue-50 dark:bg-blue-950/40 rounded-xl flex flex-col items-center justify-center text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40 shrink-0">
                      <span className="text-sm font-black leading-none">
                        {donor.bloodType}
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
                      <span className="truncate">{donor.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium bg-slate-50 dark:bg-slate-800/60 px-3 py-2 rounded-lg">
                      <MdPhone className="text-sm text-blue-500 shrink-0" />
                      <span>{donor.phone}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">
                        Última Doação
                      </p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {formatDate(donor.lastDonated)}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        'text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-lg border',
                        donor.status === 'Ready'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900/40'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/40'
                      )}
                    >
                      {donor.status === 'Ready' ? 'Disponível' : 'Em espera'}
                    </Badge>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleContact(donor)}
                      disabled={isLoading || isContacted}
                      className={cn(
                        'flex-1 h-9 rounded-xl text-xs font-bold justify-between pr-3 transition-all border',
                        isContacted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/30'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-200 dark:hover:border-blue-800'
                      )}
                    >
                      <span>
                        {isLoading ? (
                          <LoadingDots />
                        ) : isContacted ? (
                          'Contactado ✓'
                        ) : (
                          'Ver Análise'
                        )}
                      </span>
                      {!isLoading && !isContacted && (
                        <MdChevronRight className="text-base" />
                      )}
                    </Button>
                  </div>
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
