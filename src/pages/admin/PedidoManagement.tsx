import { useAdminPedidos } from '@/service/admin/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MdNotificationsActive, MdLocalHospital } from 'react-icons/md';

export const PedidoManagement = () => {
  const { data: pedidos, isLoading } = useAdminPedidos();

  if (isLoading)
    return (
      <div className="p-8 text-center font-bold animate-pulse text-slate-500">
        A carregar pedidos urgentes...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-dark-text dark:text-white tracking-tight flex items-center gap-2">
          <MdNotificationsActive className="text-orange-500" /> Monitoramento de
          Pedidos Urgentes
        </h1>
        <p className="text-neutral-text font-medium text-lg">
          Visualize os pedidos de sangue (urgências e carências) feitos pelos
          hospitais.
        </p>
      </div>

      <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
            Todos os Pedidos
            <Badge variant="outline" className="ml-2 font-bold">
              {pedidos?.length || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Hospital</th>
                  <th className="px-4 py-3">Tipo Solicitado</th>
                  <th className="px-4 py-3">Qtd (Bolsas)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {pedidos?.map((p: any) => (
                  <tr
                    key={p.id_pedido}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                      #{p.id_pedido}
                    </td>
                    <td className="px-4 py-3 font-bold flex items-center gap-1">
                      <MdLocalHospital className="text-slate-400" />{' '}
                      {p.id_hospital}
                    </td>
                    <td className="px-4 py-3 font-bold text-red-600">
                      {p.tipo_sanguineo_necessario
                        ?.replace('_POS', '+')
                        .replace('_NEG', '-')}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {p.quantidade_necessaria} Bolsas
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={
                          p.status_pedido === 'ativo'
                            ? 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }
                      >
                        {p.status_pedido?.toUpperCase() || 'DESCONHECIDO'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(p.data_pedido).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!pedidos || pedidos.length === 0) && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-slate-500 font-medium"
                    >
                      Nenhum pedido registado.
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
