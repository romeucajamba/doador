import { useAdminStock } from '@/service/admin/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MdInventory, MdBloodtype, MdLocalHospital } from 'react-icons/md';

export const StockManagement = () => {
  const { data: stock, isLoading } = useAdminStock();

  if (isLoading)
    return (
      <div className="p-8 text-center font-bold animate-pulse text-slate-500">
        A carregar stock global...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-dark-text dark:text-white tracking-tight flex items-center gap-2">
          <MdInventory className="text-red-500" /> Stock Global de Sangue
        </h1>
        <p className="text-neutral-text font-medium text-lg">
          Visão geral de todas as bolsas de sangue disponíveis na rede
          hospitalar.
        </p>
      </div>

      <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
            Lotes Registados
            <Badge variant="outline" className="ml-2 font-bold">
              {stock?.length || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">ID Stock</th>
                  <th className="px-4 py-3">Tipo Sanguíneo</th>
                  <th className="px-4 py-3">Quantidade (Bolsas)</th>
                  <th className="px-4 py-3">Hospital</th>
                  <th className="px-4 py-3">Última Atualização</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stock?.map((s: any) => (
                  <tr
                    key={s.id_stock}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                      #{s.id_stock}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className="font-black bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-900"
                      >
                        <MdBloodtype className="mr-1" />
                        {s.tipo_sanguineo
                          ?.replace('_POS', '+')
                          .replace('_NEG', '-')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-bold text-dark-text dark:text-white">
                      {s.quantidade_bolsas} Bolsas
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      <div className="flex items-center gap-1">
                        <MdLocalHospital /> {s.id_hospital}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {s.ultima_atualizacao
                        ? new Date(s.ultima_atualizacao).toLocaleString()
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
                {(!stock || stock.length === 0) && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-slate-500 font-medium"
                    >
                      Nenhum lote de sangue registado.
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
