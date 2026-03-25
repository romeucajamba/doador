import { useState } from 'react';
import { 
  MdSearch, 
  MdLocationOn, 
  MdCall, 
  MdInfo, 
  MdCalendarMonth 
} from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/stores/useNotificationStore';

const MOCK_HOSPITALS = [
  {
    id: 'h1',
    name: "Hospital Josina Machel",
    address: "Rua Neves Freire, Luanda",
    distance: "1.2 km",
    status: "Urgent O- Needed",
    type: "Public Hospital",
    phone: "+244 923 111 222",
  },
  {
    id: 'h2',
    name: "Clínica Girassol",
    address: "Rua Comandante Gika, Luanda",
    distance: "3.5 km",
    status: "Accepting All Types",
    type: "Private Clinic",
    phone: "+244 923 333 444",
  },
  {
    id: 'h3',
    name: "Centro de Hemoterapia de Luanda",
    address: "Avenida Deolinda Rodrigues",
    distance: "4.8 km",
    status: "Campaign Today",
    type: "Blood Center",
    phone: "+244 923 555 666",
  },
];

export const HospitalList = () => {
  const [search, setSearch] = useState('');
  const addNotification = useNotificationStore(state => state.addNotification);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const filtered = MOCK_HOSPITALS.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase()) || 
    h.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleContact = (name: string) => {
    setActiveAction(`contact-${name}`);
    setTimeout(() => {
      setActiveAction(null);
      alert(`A ligar para ${name}...`);
    }, 1000);
  };

  const handleBook = (name: string) => {
    setActiveAction(`book-${name}`);
    setTimeout(() => {
      setActiveAction(null);
      addNotification({
        title: 'Pedido de Agendamento',
        message: `Seu interesse foi enviado para o ${name}. Eles entrarão em contacto em breve para confirmar o horário.`,
        type: 'success'
      });
      alert(`Pedido enviado para ${name}!`);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark-text dark:text-white leading-tight">Centros de Doação</h1>
          <p className="text-neutral-text font-bold uppercase tracking-widest text-[10px] mt-2">Encontre o lugar mais próximo para salvar vidas</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl h-14 px-6 border-gray-100 dark:border-slate-800 font-bold hidden md:flex hover:bg-slate-50 dark:hover:bg-slate-800">
            Vista de Mapa
          </Button>
          <Button className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
            Centros de Emergência
          </Button>
        </div>
      </div>

      <Input 
        placeholder="Pesquisar por nome ou rua..." 
        icon={<MdSearch className="text-2xl" />} 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-16 rounded-[1.2rem] bg-white dark:bg-slate-900 border-none shadow-xl px-12 font-bold text-dark-text dark:text-white"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
        {filtered.map((hospital) => (
          <Card key={hospital.id} className="overflow-hidden group hover:shadow-2xl transition-all border-none bg-white dark:bg-slate-900 shadow-xl rounded-[2.5rem] border border-gray-100 dark:border-slate-800">
            <CardContent className="p-0">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 min-w-0">
                    <Badge className="bg-slate-50 dark:bg-slate-800 text-neutral-text font-black px-3 py-1.5 rounded-xl text-[9px] tracking-widest uppercase border-gray-100 dark:border-slate-700">
                      {hospital.type}
                    </Badge>
                    <h3 className="text-xl font-black text-dark-text dark:text-white truncate group-hover:text-primary transition-colors">
                      {hospital.name}
                    </h3>
                  </div>
                  <div className="shrink-0">
                    <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm border border-primary/10">
                      <MdLocationOn className="text-base" /> {hospital.distance}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-neutral-text dark:text-gray-400 text-sm font-bold bg-slate-50/50 dark:bg-slate-800/30 p-4 rounded-2xl border border-gray-50 dark:border-gray-800">
                  <MdLocationOn className="mt-0.5 text-xl shrink-0 text-info" />
                  <span className="leading-relaxed">{hospital.address}</span>
                </div>

                <div className={cn(
                  "p-5 rounded-[1.5rem] flex items-center gap-4 transition-all shadow-sm",
                  hospital.status.includes('Urgent') 
                    ? "bg-primary/5 text-primary border border-primary/20" 
                    : "bg-success/5 text-success border border-success/20"
                )}>
                  <MdInfo className="text-2xl shrink-0 animate-pulse" />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{hospital.status}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    className="rounded-2xl border-gray-100 dark:border-slate-800 font-black h-14 text-dark-text dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 uppercase tracking-widest text-[10px] shadow-sm transform transition-all active:scale-95"
                    onClick={() => handleContact(hospital.name)}
                    disabled={activeAction === `contact-${hospital.name}`}
                  >
                    <MdCall className="text-xl mr-2 text-primary" /> 
                    {activeAction === `contact-${hospital.name}` ? 'A ligar...' : 'Contactar'}
                  </Button>
                  <Button 
                    className="rounded-2xl font-black h-14 bg-dark-text text-white hover:bg-black transition-all shadow-xl shadow-black/10 uppercase tracking-widest text-[10px] transform active:scale-95 flex items-center gap-2"
                    onClick={() => handleBook(hospital.name)}
                    disabled={activeAction === `book-${hospital.name}`}
                  >
                    <MdCalendarMonth className="text-xl" /> 
                    {activeAction === `book-${hospital.name}` ? '...' : 'Agendar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="py-20 text-center space-y-6 col-span-full bg-white dark:bg-slate-900 rounded-[3rem] border border-gray-100 dark:border-slate-800 shadow-xl">
            <div className="size-24 bg-slate-50 dark:bg-slate-800 rounded-[2rem] mx-auto flex items-center justify-center text-5xl shadow-inner">
              🏥
            </div>
            <div className="space-y-2">
              <p className="text-dark-text dark:text-white font-black text-xl">Nenhum centro encontrado</p>
              <p className="text-neutral-text font-bold italic text-sm px-8">Lamentamos, mas não encontramos hospitais que correspondam à sua pesquisa: "{search}"</p>
            </div>
            <Button onClick={() => setSearch('')} variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">
              Limpar Pesquisa
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
