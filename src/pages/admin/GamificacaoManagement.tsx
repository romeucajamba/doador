import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/axios';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MdStar, MdLeaderboard } from 'react-icons/md';

export const GamificacaoManagement = () => {
  const { data: regras, isLoading } = useQuery({
    queryKey: ['admin-gamificacao-regras'],
    queryFn: async () => {
      const { data } = await api.get<any[]>('/gamificacao/regras');
      return data;
    },
  });

  if (isLoading)
    return (
      <div className="p-8 text-center font-bold animate-pulse text-slate-500">
        A carregar regras...
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-dark-text dark:text-white tracking-tight flex items-center gap-2">
          <MdLeaderboard className="text-yellow-500" /> Gamificação
        </h1>
        <p className="text-neutral-text font-medium text-lg">
          Gerencie os níveis e as pontuações dos doadores.
        </p>
      </div>

      <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
            Regras e Níveis
            <Badge variant="outline" className="ml-2 font-bold">
              {regras?.length || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">ID Regra</th>
                  <th className="px-4 py-3">Nome / Nível</th>
                  <th className="px-4 py-3">Pontos Mínimos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {regras?.map((r: any) => (
                  <tr
                    key={r.id_regra}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-slate-600 dark:text-slate-300">
                      #{r.id_regra}
                    </td>
                    <td className="px-4 py-3 font-bold flex items-center gap-1">
                      <MdStar className="text-yellow-400" /> {r.nome}
                    </td>
                    <td className="px-4 py-3 font-bold text-dark-text dark:text-white">
                      {r.pontos_necessarios}
                    </td>
                  </tr>
                ))}
                {(!regras || regras.length === 0) && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-slate-500 font-medium"
                    >
                      Nenhuma regra encontrada.
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
