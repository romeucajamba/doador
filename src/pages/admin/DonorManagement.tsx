import { useAdminDonors, useChangeDonorStatus } from '@/service/admin/donor';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MdCheckCircle, MdBlock, MdWarning, MdBloodtype, MdPerson } from 'react-icons/md';

export const DonorManagement = () => {
  const { data: donors, isLoading } = useAdminDonors();
  const changeStatus = useChangeDonorStatus();

  const handleActivate = async (id: number) => {
    if (confirm('Tem a certeza que deseja ativar este doador? Ele poderá aceder ao sistema normalmente.')) {
      await changeStatus.mutateAsync({ id, status: 'ativo' });
    }
  };

  const handleBlock = async (id: number) => {
    if (confirm('Tem a certeza que deseja BLOQUEAR este doador? Ele não poderá fazer login nem doar.')) {
      await changeStatus.mutateAsync({ id, status: 'bloqueado' });
    }
  };

  const handleSuspend = async (id: number) => {
    if (confirm('Deseja suspender temporariamente este doador?')) {
      await changeStatus.mutateAsync({ id, status: 'inativo' });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center font-bold animate-pulse text-slate-500">A carregar doadores...</div>;
  }

  const ativos = donors?.filter((d) => d.status === 'ativo') || [];
  const inativos = donors?.filter((d) => d.status === 'inativo') || [];
  const bloqueados = donors?.filter((d) => d.status === 'bloqueado') || [];

  const renderTable = (list: typeof donors, title: string, emptyMsg: string, statusType: 'ativo' | 'inativo' | 'bloqueado') => (
    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800 mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
          {title}
          <Badge variant="outline" className="ml-2 font-bold">{list?.length || 0}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Doador</th>
                <th className="px-4 py-3">Tipo Sanguíneo</th>
                <th className="px-4 py-3">Contactos</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {list?.map((d) => (
                <tr key={d.id_doador} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-dark-text dark:text-white flex items-center gap-2">
                      <MdPerson className="text-slate-400 text-lg" />
                      {d.nome_completo}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="font-black bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-900">
                      <MdBloodtype className="mr-1" />
                      {d.tipo_sanguineo.replace('_POS', '+').replace('_NEG', '-')}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-600 dark:text-slate-300 font-medium">{d.telefone}</div>
                    {d.email && <div className="text-xs text-slate-400">{d.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {statusType === 'ativo' && (
                      <>
                        <button
                          onClick={() => handleSuspend(d.id_doador)}
                          disabled={changeStatus.isPending}
                          className="px-3 py-1.5 bg-orange-100 text-orange-600 hover:bg-orange-200 font-bold rounded-lg transition-colors inline-flex items-center gap-1 text-xs disabled:opacity-50"
                        >
                          <MdWarning className="text-sm" /> Suspender
                        </button>
                        <button
                          onClick={() => handleBlock(d.id_doador)}
                          disabled={changeStatus.isPending}
                          className="px-3 py-1.5 bg-red-500 text-white hover:bg-red-600 font-bold rounded-lg transition-colors inline-flex items-center gap-1 text-xs disabled:opacity-50"
                        >
                          <MdBlock className="text-sm" /> Bloquear
                        </button>
                      </>
                    )}
                    {statusType !== 'ativo' && (
                      <button
                        onClick={() => handleActivate(d.id_doador)}
                        disabled={changeStatus.isPending}
                        className="px-3 py-1.5 bg-green-500 text-white hover:bg-green-600 font-bold rounded-lg transition-colors inline-flex items-center gap-1 text-xs disabled:opacity-50"
                      >
                        <MdCheckCircle className="text-sm" /> Ativar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {list?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500 font-medium">
                    {emptyMsg}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-dark-text dark:text-white tracking-tight">
          Gestão de Doadores
        </h1>
        <p className="text-neutral-text font-medium text-lg">
          Gerencie o acesso e o estado de todos os doadores registados no sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-black text-primary mb-2">{donors?.length || 0}</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Registados</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-black text-green-500 mb-2">{ativos.length}</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Ativos</div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-black text-red-500 mb-2">{bloqueados.length}</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Bloqueados</div>
        </div>
      </div>

      {renderTable(ativos, 'Doadores Ativos', 'Nenhum doador ativo.', 'ativo')}
      {renderTable(inativos, 'Doadores Suspensos', 'Nenhum doador suspenso.', 'inativo')}
      {renderTable(bloqueados, 'Doadores Bloqueados', 'Nenhum doador bloqueado.', 'bloqueado')}

    </div>
  );
};
