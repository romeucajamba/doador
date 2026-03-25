import { useState } from 'react';
import { 
  MdCalendarMonth, 
  MdLocationOn, 
  MdAccessTime, 
  MdCheckCircle, 
  MdFileDownload, 
  MdInfo,
  MdCancel,
  MdEditCalendar
} from 'react-icons/md';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAppointmentStore } from '@/stores/useAppointmentStore';
import { cn } from '@/lib/utils';

export const Appointments = () => {
  const appointments = useAppointmentStore((state) => state.appointments);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setIsDownloading(id);
    setTimeout(() => {
      setIsDownloading(null);
      alert('Seu comprovativo foi gerado e o download começará em breve.');
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-dark-text dark:text-white">Meus Agendamentos</h1>
          <p className="text-neutral-text font-bold uppercase tracking-widest text-xs mt-2">Gerencie seus donativos passados e futuros</p>
        </div>
        <Button className="rounded-[1.2rem] h-14 px-8 font-black uppercase tracking-widest text-xs bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
          Agendar Novo Donativo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
        {appointments.length === 0 ? (
          <div className="col-span-full p-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-800">
            <MdCalendarMonth className="text-7xl text-gray-200 dark:text-slate-800 mx-auto mb-4" />
            <p className="text-neutral-text font-bold text-lg italic">Nenhum agendamento encontrado.</p>
          </div>
        ) : (
          appointments.map((apt) => (
            <Card key={apt.id} className="border-none shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all rounded-[2.5rem] bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 cursor-pointer">
              <CardContent className="p-0">
                <div className="flex flex-col h-full">
                  <div className={cn(
                    "h-3 w-full shrink-0",
                    apt.status === 'completed' ? "bg-success" : 
                    apt.status === 'pending' ? "bg-warning" : "bg-primary"
                  )}></div>
                  <div className="p-8 flex-1 flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-dark-text dark:text-white group-hover:text-primary transition-colors">{apt.hospitalName}</h3>
                        <div className="flex items-center gap-2 text-neutral-text text-[10px] font-black uppercase tracking-widest mt-2">
                          <MdAccessTime className="text-lg text-info" /> {apt.date} • {apt.time}
                        </div>
                      </div>
                      <Badge 
                        className={cn(
                          "rounded-xl px-4 py-2 font-black uppercase text-[9px] tracking-widest transition-all",
                          apt.status === 'completed' ? "bg-success/10 text-success border-success/20" : 
                          apt.status === 'pending' ? "bg-warning/10 text-warning border-warning/20" : "bg-primary/10 text-primary border-primary/20"
                        )}
                      >
                        {apt.status === 'completed' ? 'CONCLUÍDO' : apt.status === 'pending' ? 'PENDENTE' : 'CANCELADO'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-gray-50 dark:border-gray-800">
                      <div className="size-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-gray-100 dark:border-slate-700">
                        <span className="text-primary font-black text-xs">O+</span>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase text-neutral-text leading-none tracking-widest mb-1">Tipo de Doação</p>
                        <p className="text-sm font-black text-dark-text dark:text-white truncate uppercase">{apt.type}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 border-gray-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                          onClick={() => setSelectedAppointment(apt)}
                        >
                          <MdInfo className="text-base text-primary" /> Saber Mais
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 border-gray-100 dark:border-gray-800 hover:bg-info/5 hover:text-info transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(apt.id);
                          }}
                          disabled={isDownloading === apt.id}
                        >
                          <MdFileDownload className="text-base" /> 
                          {isDownloading === apt.id ? '...' : 'Recibo'}
                        </Button>
                      </div>

                      {apt.status === 'pending' && (
                        <div className="flex gap-2">
                           <Button variant="outline" className="flex-1 rounded-xl h-12 text-destructive border-destructive/10 hover:bg-destructive/5 font-black uppercase tracking-widest text-[10px] gap-2">
                            <MdCancel className="text-base" /> Cancelar
                          </Button>
                          <Button className="flex-1 rounded-xl h-12 font-black uppercase tracking-widest text-[10px] bg-dark-text text-white hover:bg-black transition-all gap-2">
                            <MdEditCalendar className="text-base" /> Reagendar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300" onClick={() => setSelectedAppointment(null)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl z-[60] overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-gray-100 dark:border-slate-800">
            <div className="p-8 bg-primary text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <MdCalendarMonth className="text-9xl rotate-12" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-1">Detalhes do Agendamento</h2>
              <p className="text-white/80 font-bold text-sm tracking-wide">Código: #{selectedAppointment.id.substring(0, 8).toUpperCase()}</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-gray-50 dark:border-gray-800">
                  <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-3xl">
                    <MdLocationOn />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-neutral-text uppercase tracking-widest">Hospital Selecionado</p>
                    <p className="font-black text-dark-text dark:text-white uppercase tracking-tight text-lg">{selectedAppointment.hospitalName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-gray-50 dark:border-gray-800">
                    <div className="size-12 rounded-xl bg-info/10 flex items-center justify-center text-info text-2xl">
                      <MdCalendarMonth />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-neutral-text uppercase tracking-widest">Data</p>
                      <p className="font-black text-dark-text dark:text-white">{selectedAppointment.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-gray-50 dark:border-gray-800">
                    <div className="size-12 rounded-xl bg-success/10 flex items-center justify-center text-success text-2xl">
                      <MdAccessTime />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-neutral-text uppercase tracking-widest">Horário</p>
                      <p className="font-black text-dark-text dark:text-white">{selectedAppointment.time}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-gray-100 dark:border-gray-800 space-y-4">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-widest text-center">Instruções Prévias</h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    'Estar bem alimentado antes da doação',
                    'Ter dormido pelo menos 6 horas',
                    'Apresentar documento Original com foto',
                    'Beber bastante água nas horas anteriores'
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-50 dark:border-slate-700">
                      <MdCheckCircle className="text-xl text-success shrink-0" />
                      <p className="text-xs font-bold text-neutral-text leading-tight">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => setSelectedAppointment(null)}
                className="w-full h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/10"
              >
                Fechar Detalhes
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
