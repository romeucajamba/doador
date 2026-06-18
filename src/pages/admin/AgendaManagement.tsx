import { useAdminAgenda } from '@/service/admin/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MdEventNote, MdLocalHospital, MdPerson, MdAccessTime } from 'react-icons/md';

export const AgendaManagement = () => {
  const { data: agendas, isLoading } = useAdminAgenda();

  if (isLoading) return <div className="p-8 text-center font-bold animate-pulse text-slate-500">A carregar agendamentos...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-dark-text dark:text-white tracking-tight flex items-center gap-2">
          <MdEventNote className="text-purple-500" /> Agendamentos Globais
        </h1>
        <p className="text-neutral-text font-medium text-lg">
          Consulte todas as marcações de doação de sangue na rede.
        </p>
      </div>

      <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
            Todas as Consultas
            <Badge variant="outline" className="ml-2 font-bold">{agendas?.length || 0}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Data e Hora</th>
                  <th className="px-4 py-3">Hospital</th>
                  <th className="px-4 py-3">Doador</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {agendas?.map((a: any) => (
                  <tr key={a.id_agenda} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-dark-text dark:text-white">
                          {new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(a.data_agendada))}
                        </span>
                        {a.hora_agendada && (
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                            <MdAccessTime className="text-slate-400" /> {a.hora_agendada}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-1">
                        <MdLocalHospital className="text-slate-400" /> {a.id_hospital}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <MdPerson className="text-slate-400" /> #{a.id_doador}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={a.status === 'concluida' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}>
                        {a.status ? String(a.status).toUpperCase() : 'DESCONHECIDO'}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {(!agendas || agendas.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500 font-medium">
                      Nenhum agendamento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
