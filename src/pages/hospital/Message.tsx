import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdSearch,
  MdSend,
  MdBloodtype,
  MdBusiness,
  MdEmergency,
  MdCheckCircle,
  MdMoreVert,
  MdFilterList,
} from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

// Mock de dados para hospitais de Angola
const CHATS = [
  {
    id: 1,
    hospital: 'Hospital Josina Machel',
    lastMsg: 'Precisamos de 5 unidades de O+ para uma cirurgia de urgência.',
    time: '10:25',
    unread: 2,
    isEmergency: true,
    province: 'Luanda',
  },
  {
    id: 2,
    hospital: 'Maternidade Lucrécia Paim',
    lastMsg: 'Confirmamos a recepção das bolsas de plasma. Obrigado.',
    time: 'Ontem',
    unread: 0,
    isEmergency: false,
    province: 'Luanda',
  },
  {
    id: 3,
    hospital: 'Hospital Geral de Benguela',
    lastMsg: 'Temos excedente de AB-, alguém necessita?',
    time: 'Segunda',
    unread: 0,
    isEmergency: false,
    province: 'Benguela',
  },
];

export const HospitalMessenger = () => {
  const [activeChat, setActiveChat] = useState(CHATS[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="flex h-[calc(100vh-120px)] max-w-7xl mx-auto overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
      {/* --- LISTA DE CONVERSAS (Sidebar) --- */}
      <aside className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Mensagens</h2>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <MdFilterList />
            </Button>
          </div>
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Procurar hospital..."
              className="pl-10 bg-white border-slate-200 rounded-lg h-10 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {CHATS.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={cn(
                'w-full p-4 flex gap-3 transition-all border-b border-slate-100 hover:bg-white text-left',
                activeChat.id === chat.id
                  ? 'bg-white border-l-4 border-l-red-600 shadow-sm'
                  : 'border-l-4 border-l-transparent'
              )}
            >
              <div
                className={cn(
                  'size-12 rounded-lg flex items-center justify-center shrink-0 text-white font-bold',
                  chat.isEmergency ? 'bg-red-500 animate-pulse' : 'bg-slate-300'
                )}
              >
                {chat.hospital.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {chat.hospital}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {chat.time}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate line-clamp-1">
                  {chat.lastMsg}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold italic">
                    {chat.province}
                  </span>
                  {chat.unread > 0 && (
                    <Badge className="bg-red-600 text-[10px] h-5 min-w-5 flex items-center justify-center rounded-full">
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* --- ÁREA DA CONVERSA --- */}
      <main className="hidden md:flex flex-1 flex-col bg-white">
        {/* Header do Chat */}
        <header className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              {activeChat.hospital[0]}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-none">
                {activeChat.hospital}
              </h3>
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">
                Ligado agora
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-slate-200 rounded-lg"
            >
              <MdBloodtype className="mr-2 text-red-500" /> Ver Estoque deles
            </Button>
            <Button variant="ghost" size="icon">
              <MdMoreVert />
            </Button>
          </div>
        </header>

        {/* Mensagens (Visualização) */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/30">
          <div className="flex justify-center">
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">
              Hoje
            </span>
          </div>

          {/* Mensagem Recebida */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 max-w-[80%]"
          >
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-red-600 font-bold text-[10px] uppercase">
                <MdEmergency /> Requisição de Urgência
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">
                Saudações colegas. Temos um paciente em estado crítico e o nosso
                estoque de <strong>O Positivo</strong> esgotou. Conseguem ceder
                5 unidades? Enviamos a ambulância para recolha imediata.
              </p>
              <span className="text-[9px] text-slate-400 mt-2 block text-right">
                10:25
              </span>
            </div>
          </motion.div>

          {/* Mensagem Enviada */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-row-reverse gap-3 max-w-[80%] ml-auto"
          >
            <div className="bg-slate-900 text-white p-4 rounded-2xl rounded-tr-none shadow-md">
              <p className="text-sm leading-relaxed">
                Bom dia. Temos disponibilidade. Já estamos a preparar as bolsas
                com o protocolo de transporte térmico. Podem enviar a equipa.
              </p>
              <div className="flex items-center justify-end gap-1 mt-2">
                <span className="text-[9px] text-slate-400 block">10:28</span>
                <MdCheckCircle className="text-blue-400 size-3" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Input de Mensagem */}
        <footer className="p-4 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMessage('');
            }}
            className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva a sua mensagem ou requisição..."
              className="border-none bg-transparent focus-visible:ring-0 text-sm"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-red-600 hover:bg-red-700 rounded-lg shrink-0 shadow-lg"
              disabled={!message.trim()}
            >
              <MdSend className="text-white" />
            </Button>
          </form>
        </footer>
      </main>
    </div>
  );
};
