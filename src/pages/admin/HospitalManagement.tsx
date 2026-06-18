import {
  useAdminHospitals,
  useChangeHospitalStatus,
} from '@/service/admin/hospital';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MdCheckCircle, MdBlock, MdWarning } from 'react-icons/md';

export const HospitalManagement = () => {
  const { data: hospitals, isLoading } = useAdminHospitals();
  const changeStatus = useChangeHospitalStatus();

  const handleApprove = async (id: number) => {
    if (confirm('Aprovar este hospital e permitir-lhe acesso ao sistema?')) {
      await changeStatus.mutateAsync({ id, status: 'ativo' });
    }
  };

  const handleSuspend = async (id: number) => {
    if (
      confirm('Suspender este hospital? Ele perderá o acesso imediatamente.')
    ) {
      await changeStatus.mutateAsync({ id, status: 'suspenso' });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center font-bold animate-pulse text-slate-500">
        A carregar hospitais...
      </div>
    );
  }

  const pendentes = hospitals?.filter((h) => h.status === 'pendente') || [];
  const ativos = hospitals?.filter((h) => h.status === 'ativo') || [];
  const suspensos =
    hospitals?.filter(
      (h) => h.status === 'suspenso' || h.status === 'inativo'
    ) || [];

  const renderTable = (
    list: typeof hospitals,
    title: string,
    emptyMsg: string
  ) => (
    <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800 mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
          {title}
          <Badge variant="outline" className="ml-2 font-bold">
            {list?.length || 0}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Hospital</th>
                <th className="px-4 py-3">NIF</th>
                <th className="px-4 py-3">Contactos</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {list?.map((h) => (
                <tr
                  key={h.id_hospital}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-bold text-dark-text dark:text-white">
                      {h.nome}
                    </div>
                    <div className="text-xs text-slate-400">{h.endereco}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-500">
                    {h.nif}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-600 dark:text-slate-300">
                      {h.email}
                    </div>
                    <div className="text-xs text-slate-400">{h.telefone}</div>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {h.status === 'pendente' && (
                      <>
                        <button
                          onClick={() => handleApprove(h.id_hospital)}
                          disabled={changeStatus.isPending}
                          className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1 text-xs disabled:opacity-50"
                        >
                          <MdCheckCircle className="text-sm" /> Aprovar
                        </button>
                        <button
                          onClick={() => handleSuspend(h.id_hospital)}
                          disabled={changeStatus.isPending}
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors inline-flex items-center gap-1 text-xs disabled:opacity-50"
                        >
                          <MdBlock className="text-sm" /> Rejeitar
                        </button>
                      </>
                    )}
                    {h.status === 'ativo' && (
                      <button
                        onClick={() => handleSuspend(h.id_hospital)}
                        disabled={changeStatus.isPending}
                        className="px-3 py-1.5 bg-orange-100 text-orange-600 hover:bg-orange-200 font-bold rounded-lg transition-colors inline-flex items-center gap-1 text-xs disabled:opacity-50"
                      >
                        <MdWarning className="text-sm" /> Suspender
                      </button>
                    )}
                    {(h.status === 'suspenso' || h.status === 'inativo') && (
                      <button
                        onClick={() => handleApprove(h.id_hospital)}
                        disabled={changeStatus.isPending}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-lg transition-colors inline-flex items-center gap-1 text-xs disabled:opacity-50"
                      >
                        <MdCheckCircle className="text-sm" /> Reativar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {list?.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-slate-500 font-medium"
                  >
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
          Aprovação de Hospitais
        </h1>
        <p className="text-neutral-text font-medium text-lg">
          Reveja e aprove novos hospitais para entrarem no sistema Blood Hub.
        </p>
      </div>

      {renderTable(
        pendentes,
        'Hospitais Pendentes (Aguardam Aprovação)',
        'Não há hospitais pendentes no momento.'
      )}
      {renderTable(ativos, 'Hospitais Ativos', 'Nenhum hospital ativo.')}
      {renderTable(
        suspensos,
        'Hospitais Suspensos / Inativos',
        'Não existem hospitais suspensos.'
      )}
    </div>
  );
};
