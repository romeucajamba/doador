import { useAdminComunicacao } from '@/service/admin/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MdChat, MdPerson } from 'react-icons/md';

export const ComunicacaoManagement = () => {
  const { data: notificacoes, isLoading } = useAdminComunicacao();

  if (isLoading) return <div className="p-8 text-center font-bold animate-pulse text-slate-500">A carregar notificações...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-dark-text dark:text-white tracking-tight flex items-center gap-2">
          <MdChat className="text-indigo-500" /> Comunicação & Notificações
        </h1>
        <p className="text-neutral-text font-medium text-lg">
          Central de mensagens e alertas do sistema.
        </p>
      </div>

      <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
            Alertas Enviados
            <Badge variant="outline" className="ml-2 font-bold">{notificacoes?.length || 0}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Doador</th>
                  <th className="px-4 py-3">Mensagem</th>
                  <th className="px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {notificacoes?.map((n: any) => (
                  <tr key={n.id_notificacao} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={n.status_envio === 'sucesso' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}>
                        {n.status_envio ? String(n.status_envio).toUpperCase() : 'DESCONHECIDO'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1">
                        <MdPerson className="text-slate-400" /> #{n.id_doador}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{n.mensagem_enviada}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(n.data_envio).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {(!notificacoes || notificacoes.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500 font-medium">
                      Nenhuma notificação encontrada.
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
