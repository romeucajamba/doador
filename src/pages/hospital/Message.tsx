import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MdSearch,
  MdSend,
  MdInbox,
  MdOutbox,
  MdAdd,
  MdClose,
  MdCheck,
} from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useHospitalAuthStore } from '@/hooks/hospitalAuth';
import { api } from '@/utils/axios';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Hospital {
  id_hospital: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  status: string;
}

interface Mensagem {
  id_mensagem: number;
  id_remetente: number;
  id_destinatario: number;
  assunto: string | null;
  conteudo: string;
  lida: boolean;
  data_envio: string;
  remetente?: { id_hospital: number; nome: string };
  destinatario?: { id_hospital: number; nome: string };
}

type Tab = 'inbox' | 'enviadas';

// ─── Query keys ───────────────────────────────────────────────────────────────

const inboxKey = (id: number) => ['inbox', id] as const;
const enviadasKey = (id: number) => ['enviadas', id] as const;
const hospitaisKey = ['hospitais'] as const;

// ─── Hooks ───────────────────────────────────────────────────────────────────

const useHospitais = () =>
  useQuery<Hospital[]>({
    queryKey: hospitaisKey,
    queryFn: async () => {
      const { data } = await api.get('/hospital');
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 5,
  });

const useInbox = (id: number | undefined) =>
  useQuery<Mensagem[]>({
    queryKey: id ? inboxKey(id) : ['inbox-none'],
    queryFn: async () => {
      const { data } = await api.get(`/comunicacao/mensagem/inbox/${id}`);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!id,
    refetchInterval: 15_000, // polling leve a cada 15s
  });

const useEnviadas = (id: number | undefined) =>
  useQuery<Mensagem[]>({
    queryKey: id ? enviadasKey(id) : ['enviadas-none'],
    queryFn: async () => {
      const { data } = await api.get(`/comunicacao/mensagem/enviadas/${id}`);
      return Array.isArray(data) ? data : [];
    },
    enabled: !!id,
    refetchInterval: 15_000,
  });

const useSendMensagem = (myId: number | undefined) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id_remetente: number;
      id_destinatario: number;
      conteudo: string;
      assunto?: string;
    }) => {
      const { data } = await api.post('/comunicacao/mensagem', payload);
      return data;
    },
    onSuccess: () => {
      if (myId) {
        qc.invalidateQueries({ queryKey: enviadasKey(myId) });
        qc.invalidateQueries({ queryKey: inboxKey(myId) });
      }
    },
  });
};

const useMarkRead = (myId: number | undefined) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id_mensagem: number) => {
      await api.put(`/comunicacao/mensagem/${id_mensagem}/lida`);
    },
    onSuccess: () => {
      if (myId) qc.invalidateQueries({ queryKey: inboxKey(myId) });
    },
  });
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatTime = (iso: string): string => {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday)
    return d.toLocaleTimeString('pt-AO', {
      hour: '2-digit',
      minute: '2-digit',
    });
  if (isYesterday) return 'Ontem';
  return d.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' });
};

const formatFull = (iso: string): string =>
  new Date(iso).toLocaleString('pt-AO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const initials = (nome: string) =>
  nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

const AVATAR_PALETTE = [
  'bg-blue-600',
  'bg-violet-600',
  'bg-emerald-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-cyan-600',
];

const avatarColor = (id: number) => AVATAR_PALETTE[id % AVATAR_PALETTE.length];

// ─── Nova Mensagem Modal ──────────────────────────────────────────────────────

interface NovaMessagemModalProps {
  myId: number;
  hospitais: Hospital[];
  preselected?: Hospital | null;
  onClose: () => void;
  onSent: () => void;
}

const NovaMensagemModal = ({
  myId,
  hospitais,
  preselected,
  onClose,
  onSent,
}: NovaMessagemModalProps) => {
  const [dest, setDest] = useState<Hospital | null>(preselected ?? null);
  const [conteudo, setConteudo] = useState('');
  const [assunto, setAssunto] = useState('');
  const [searchDest, setSearchDest] = useState('');
  const [showList, setShowList] = useState(!preselected);
  const { mutate: send, isPending } = useSendMensagem(myId);

  const outros = hospitais.filter((h) => h.id_hospital !== myId);
  const filteredDest = outros.filter((h) =>
    h.nome.toLowerCase().includes(searchDest.toLowerCase())
  );

  const handleSend = () => {
    if (!dest || !conteudo.trim()) return;
    send(
      {
        id_remetente: myId,
        id_destinatario: dest.id_hospital,
        conteudo,
        assunto: assunto || undefined,
      },
      {
        onSuccess: () => {
          onSent();
          onClose();
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white">
            Nova Mensagem
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
          >
            <MdClose className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Destinatário */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Destinatário
            </label>
            {dest ? (
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <div
                  className={cn(
                    'size-8 rounded-lg flex items-center justify-center text-white text-xs font-bold',
                    avatarColor(dest.id_hospital)
                  )}
                >
                  {initials(dest.nome)}
                </div>
                <span className="flex-1 text-sm font-medium text-slate-900 dark:text-white">
                  {dest.nome}
                </span>
                <button
                  onClick={() => {
                    setDest(null);
                    setShowList(true);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <MdClose className="text-sm" />
                </button>
              </div>
            ) : (
              <div>
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    autoFocus
                    placeholder="Pesquisar hospital..."
                    value={searchDest}
                    onChange={(e) => setSearchDest(e.target.value)}
                    className="w-full h-11 pl-9 pr-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <div className="mt-2 max-h-40 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-xl">
                  {filteredDest.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">
                      Nenhum hospital encontrado
                    </p>
                  ) : (
                    filteredDest.map((h) => (
                      <button
                        key={h.id_hospital}
                        onClick={() => {
                          setDest(h);
                          setShowList(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-left transition-colors"
                      >
                        <div
                          className={cn(
                            'size-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold',
                            avatarColor(h.id_hospital)
                          )}
                        >
                          {initials(h.nome)}
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                          {h.nome}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Assunto (opcional) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Assunto{' '}
              <span className="font-normal normal-case">(opcional)</span>
            </label>
            <input
              placeholder="Ex: Requisição de sangue O+"
              value={assunto}
              onChange={(e) => setAssunto(e.target.value)}
              className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* Conteúdo */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Mensagem
            </label>
            <textarea
              placeholder="Escreva a sua mensagem..."
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-500/20 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSend}
              disabled={!dest || !conteudo.trim() || isPending}
              className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white border-0"
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-1 h-1 rounded-full bg-white animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <span
                    className="w-1 h-1 rounded-full bg-white animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-1 h-1 rounded-full bg-white animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </span>
              ) : (
                <>
                  <MdSend className="mr-2" /> Enviar
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const HospitalMessenger = () => {
  const user = useHospitalAuthStore((s) => s.user);
  const myId = user?.id_hospital;

  const { data: inbox = [] } = useInbox(myId);
  const { data: enviadas = [] } = useEnviadas(myId);
  const { data: hospitais = [] } = useHospitais();
  const { mutate: markRead } = useMarkRead(myId);

  const [tab, setTab] = useState<Tab>('inbox');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Mensagem | null>(null);
  const [showNova, setShowNova] = useState(false);
  const [preselected, setPreselected] = useState<Hospital | null>(null);
  const [message, setMessage] = useState('');

  const { mutate: send, isPending: isSending } = useSendMensagem(myId);

  const msgs = tab === 'inbox' ? inbox : enviadas;

  const filtered = useMemo(
    () =>
      msgs.filter((m) => {
        const q = search.toLowerCase();
        const nome =
          tab === 'inbox'
            ? (m.remetente?.nome ?? '')
            : (m.destinatario?.nome ?? '');
        return (
          nome.toLowerCase().includes(q) ||
          (m.assunto ?? '').toLowerCase().includes(q) ||
          m.conteudo.toLowerCase().includes(q)
        );
      }),
    [msgs, search, tab]
  );

  const unreadCount = inbox.filter((m) => !m.lida).length;

  // Marca como lida ao seleccionar
  const handleSelect = (m: Mensagem) => {
    setSelected(m);
    if (tab === 'inbox' && !m.lida) markRead(m.id_mensagem);
  };

  // Responder directamente no painel
  const handleReply = () => {
    if (!selected || !message.trim() || !myId) return;
    const destId =
      tab === 'inbox' ? selected.id_remetente : selected.id_destinatario;
    send(
      { id_remetente: myId, id_destinatario: destId, conteudo: message },
      { onSuccess: () => setMessage('') }
    );
  };

  // Nome do interlocutor na conversa seleccionada
  const interlocutorNome = (m: Mensagem): string => {
    if (tab === 'inbox')
      return m.remetente?.nome ?? `Hospital #${m.id_remetente}`;
    return m.destinatario?.nome ?? `Hospital #${m.id_destinatario}`;
  };

  const interlocutorId = (m: Mensagem): number =>
    tab === 'inbox' ? m.id_remetente : m.id_destinatario;

  return (
    <>
      <div className="flex h-[calc(100vh-120px)] max-w-7xl mx-auto overflow-hidden border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm">
        {/* ── Sidebar ── */}
        <aside className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
          {/* Sidebar header */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Mensagens
              </h2>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setPreselected(null);
                  setShowNova(true);
                }}
                className="rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                title="Nova mensagem"
              >
                <MdAdd className="text-xl" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
              {(
                [
                  ['inbox', 'Recebidas'],
                  ['enviadas', 'Enviadas'],
                ] as [Tab, string][]
              ).map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setSelected(null);
                  }}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition-all',
                    tab === t
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  )}
                >
                  {t === 'inbox' ? (
                    <MdInbox className="text-sm" />
                  ) : (
                    <MdOutbox className="text-sm" />
                  )}
                  {label}
                  {t === 'inbox' && unreadCount > 0 && (
                    <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="py-12 text-center px-4">
                <MdInbox className="text-3xl text-slate-200 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-400">
                  {msgs.length === 0
                    ? 'Nenhuma mensagem ainda'
                    : 'Sem resultados'}
                </p>
              </div>
            ) : (
              filtered.map((m) => {
                const nome = interlocutorNome(m);
                const id = interlocutorId(m);
                const isUnread = tab === 'inbox' && !m.lida;

                return (
                  <button
                    key={m.id_mensagem}
                    onClick={() => handleSelect(m)}
                    className={cn(
                      'w-full p-4 flex gap-3 transition-all border-b border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/60 text-left',
                      selected?.id_mensagem === m.id_mensagem
                        ? 'bg-white dark:bg-slate-800 border-l-4 border-l-red-600 shadow-sm'
                        : 'border-l-4 border-l-transparent',
                      isUnread && 'bg-red-50/40 dark:bg-red-950/10'
                    )}
                  >
                    <div
                      className={cn(
                        'size-10 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold',
                        avatarColor(id)
                      )}
                    >
                      {initials(nome)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4
                          className={cn(
                            'text-xs truncate',
                            isUnread
                              ? 'font-black text-slate-900 dark:text-white'
                              : 'font-semibold text-slate-700 dark:text-slate-300'
                          )}
                        >
                          {nome}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                          {formatTime(m.data_envio)}
                        </span>
                      </div>
                      {m.assunto && (
                        <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 truncate mb-0.5">
                          {m.assunto}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400 truncate">
                        {m.conteudo}
                      </p>
                      {isUnread && (
                        <span className="mt-1 inline-block w-2 h-2 rounded-full bg-red-600" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Painel de leitura ── */}
        <main className="hidden md:flex flex-1 flex-col bg-white dark:bg-slate-900">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
              <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <MdInbox className="text-3xl text-slate-300 dark:text-slate-600" />
              </div>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  Seleccione uma mensagem
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Escolha uma conversa na lista para ler.
                </p>
              </div>
              <Button
                onClick={() => {
                  setPreselected(null);
                  setShowNova(true);
                }}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl mt-2"
              >
                <MdAdd className="mr-2" /> Nova Mensagem
              </Button>
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'size-10 rounded-lg flex items-center justify-center text-white font-bold text-sm',
                      avatarColor(interlocutorId(selected))
                    )}
                  >
                    {initials(interlocutorNome(selected))}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-none">
                      {interlocutorNome(selected)}
                    </h3>
                    <span className="text-[10px] text-slate-400">
                      {formatFull(selected.data_envio)}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-slate-200 dark:border-slate-700 rounded-lg"
                  onClick={() => {
                    const h = hospitais.find(
                      (x) => x.id_hospital === interlocutorId(selected)
                    );
                    setPreselected(h ?? null);
                    setShowNova(true);
                  }}
                >
                  <MdSend className="mr-1.5 text-red-500 text-sm" /> Responder
                </Button>
              </header>

              {/* Corpo da mensagem */}
              <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 dark:bg-slate-950/20">
                {selected.assunto && (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                    Assunto
                  </p>
                )}
                {selected.assunto && (
                  <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">
                    {selected.assunto}
                  </h2>
                )}

                <motion.div
                  key={selected.id_mensagem}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'max-w-[80%] p-4 rounded-2xl shadow-sm',
                    tab === 'inbox'
                      ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                      : 'bg-slate-900 dark:bg-slate-700 text-white ml-auto rounded-tr-none'
                  )}
                >
                  <p
                    className={cn(
                      'text-sm leading-relaxed',
                      tab === 'inbox'
                        ? 'text-slate-700 dark:text-slate-200'
                        : 'text-white'
                    )}
                  >
                    {selected.conteudo}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-2">
                    <span className="text-[9px] text-slate-400">
                      {formatFull(selected.data_envio)}
                    </span>
                    {tab === 'inbox' && selected.lida && (
                      <MdCheck className="text-blue-400 size-3" />
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Input de resposta rápida */}
              <footer className="p-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && !e.shiftKey && handleReply()
                    }
                    placeholder="Resposta rápida... (Enter para enviar)"
                    className="flex-1 bg-transparent outline-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <Button
                    onClick={handleReply}
                    size="icon"
                    className="bg-red-600 hover:bg-red-700 rounded-lg shrink-0 shadow-lg"
                    disabled={!message.trim() || isSending}
                  >
                    <MdSend className="text-white" />
                  </Button>
                </div>
              </footer>
            </>
          )}
        </main>
      </div>

      {/* ── Modal Nova Mensagem ── */}
      <AnimatePresence>
        {showNova && myId && (
          <NovaMensagemModal
            myId={myId}
            hospitais={hospitais}
            preselected={preselected}
            onClose={() => {
              setShowNova(false);
              setPreselected(null);
            }}
            onSent={() => setTab('enviadas')}
          />
        )}
      </AnimatePresence>
    </>
  );
};
