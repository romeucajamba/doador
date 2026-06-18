import { useAdminAuditoria } from '@/service/admin/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MdHistory } from 'react-icons/md';

export const AuditoriaManagement = () => {
  const { data: logs, isLoading } = useAdminAuditoria();

  if (isLoading)
    return (
      <div className="p-8 text-center font-bold animate-pulse text-slate-500">
        A carregar logs do sistema...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-dark-text dark:text-white tracking-tight flex items-center gap-2">
          <MdHistory className="text-slate-500" /> Auditoria e Logs
        </h1>
        <p className="text-neutral-text font-medium text-lg">
          Registo imutável de atividades e eventos de segurança da plataforma.
        </p>
      </div>

      <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
            Eventos Recentes
            <Badge variant="outline" className="ml-2 font-bold">
              {logs?.length || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Ação</th>
                  <th className="px-4 py-3">Descrição</th>
                  <th className="px-4 py-3">IP Origem</th>
                  <th className="px-4 py-3">Entidade (ID)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {logs?.map((l: any) => (
                  <tr
                    key={l.id_log}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(l.data_hora).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className="font-bold bg-slate-100 text-slate-700"
                      >
                        {l.acao}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                      {l.descricao}
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-slate-400">
                      {l.ip_origem}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {l.id_admin && `Admin #${l.id_admin}`}
                      {l.id_hospital && `Hospital #${l.id_hospital}`}
                      {l.id_doador && `Doador #${l.id_doador}`}
                    </td>
                  </tr>
                ))}
                {(!logs || logs.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-500 font-medium"
                    >
                      Nenhum log registado.
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
