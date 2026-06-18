import { useAdminAuthStore } from '@/hooks/adminAuth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import {
  MdMap,
  MdLocalHospital,
  MdPerson,
  MdInventory,
  MdNotificationsActive,
  MdEventNote,
  MdHistory,
  MdBarChart,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useMetrics } from '@/service/admin/metrics';
import { useAdminDonors } from '@/service/admin/donor';
import { useAdminHospitals } from '@/service/admin/hospital';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useMemo } from 'react';

const COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#22c55e',
  '#0ea5e9',
  '#6366f1',
  '#a855f7',
];

export const Dashboard = () => {
  const { session } = useAdminAuthStore();
  const {
    stock,
    pedidos,
    agendas,
    logs,
    ranking,
    isLoading: loadingMetrics,
  } = useMetrics();
  const { data: donors } = useAdminDonors();
  const { data: hospitals } = useAdminHospitals();

  // --- Processamento de Dados para os Gráficos ---

  // 1. Stock por Tipo Sanguíneo (Doações Feitas/Ativas)
  const stockData = useMemo(() => {
    if (!stock) return [];
    const counts: Record<string, number> = {};
    stock.forEach((s: any) => {
      const tipo =
        s.tipo_sanguineo?.replace('_POS', '+').replace('_NEG', '-') ||
        'Desconhecido';
      counts[tipo] = (counts[tipo] || 0) + 1;
    });
    return Object.keys(counts).map((k) => ({ name: k, Quantidade: counts[k] }));
  }, [stock]);

  // 2. Pedidos por Status
  const pedidosData = useMemo(() => {
    if (!pedidos) return [];
    const counts: Record<string, number> = {};
    pedidos.forEach((p: any) => {
      const status = p.status?.toUpperCase() || 'DESCONHECIDO';
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.keys(counts).map((k) => ({ name: k, value: counts[k] }));
  }, [pedidos]);

  // 3. Pontos dos Doadores (Top 5)
  const rankingData = useMemo(() => {
    if (!ranking) return [];
    return ranking.slice(0, 5).map((r: any) => ({
      name: r.doador?.nome_completo?.split(' ')[0] || `Doador ${r.id_doador}`,
      Pontos: r.pontos_totais || 0,
    }));
  }, [ranking]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-dark-text dark:text-white tracking-tight">
          Olá, {session?.user?.nome_completo || 'Admin'} 👋
        </h1>
        <p className="text-neutral-text font-medium text-lg">
          Bem-vindo ao centro de controlo do Blood Hub. Visão 360º de todas as
          rotas ativas.
        </p>
      </div>

      {/* METRICS ROW */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">
              Doadores
            </CardTitle>
            <MdPerson className="text-xl text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{donors?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">
              Hospitais
            </CardTitle>
            <MdLocalHospital className="text-xl text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{hospitals?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">
              Stock (Lotes)
            </CardTitle>
            <MdInventory className="text-xl text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stock?.length || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500">
              Pedidos Urgentes
            </CardTitle>
            <MdNotificationsActive className="text-xl text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{pedidos?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS ROW */}
      <h2 className="text-2xl font-black pt-4 flex items-center gap-2">
        <MdBarChart className="text-primary" /> Análise Visual
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* GRAFICO STOCK */}
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-500">
              Doações / Stock por Tipo Sanguíneo
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar
                  dataKey="Quantidade"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GRAFICO PEDIDOS */}
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-500">
              Status dos Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pedidosData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pedidosData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GRAFICO PONTOS */}
        <Card className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-500">
              Top 5 Doadores (Pontos)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rankingData}
                layout="vertical"
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  width={80}
                />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Bar dataKey="Pontos" fill="#eab308" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-black pt-4">Acesso Rápido</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/geografia" className="group">
          <Card className="h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 dark:hover:border-primary/30 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-neutral-text group-hover:text-primary transition-colors">
                Gestão de Geografia
              </CardTitle>
              <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <MdMap className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-dark-text dark:text-white">
                Províncias e Municípios
              </div>
              <p className="text-xs font-bold text-neutral-text mt-2">
                Adicionar e remover regiões da plataforma.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/doadores" className="group">
          <Card className="h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 dark:hover:border-primary/30 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-neutral-text group-hover:text-primary transition-colors">
                Gestão de Doadores
              </CardTitle>
              <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <MdPerson className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-dark-text dark:text-white">
                Bloqueios e Acessos
              </div>
              <p className="text-xs font-bold text-neutral-text mt-2">
                Suspenda ou reative contas de doadores.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/hospitais" className="group">
          <Card className="h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 dark:hover:border-primary/30 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-neutral-text group-hover:text-primary transition-colors">
                Aprovação de Hospitais
              </CardTitle>
              <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                <MdLocalHospital className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black text-dark-text dark:text-white">
                Verificação Médica
              </div>
              <p className="text-xs font-bold text-neutral-text mt-2">
                Aprove ou rejeite pedidos de adesão de hospitais.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};
