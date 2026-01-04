import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  
  // --- BUSCA DADOS REAIS DO BACKEND ---
  const { data: stats, isLoading } = trpc.dashboard.getStats.useQuery();

  if (!isAuthenticated) {
    return <div className="p-8 text-center">Acesso Restrito</div>;
  }

  // Se estiver carregando, mostra zeros
  const totalEmployees = stats?.totalEmployees || 0;
  const completed = stats?.completed || 0;
  const inProgress = stats?.inProgress || 0;
  const pending = stats?.pending || 0;
  const recentActivity = stats?.recentActivity || [];

  // Dados para o Gráfico de Pizza (Reais)
  const pieData = [
    { name: "Concluído", value: completed, fill: "#10b981" },
    { name: "Em Progresso", value: inProgress, fill: "#3b82f6" },
    { name: "Pendente", value: pending, fill: "#f59e0b" },
  ].filter(d => d.value > 0); // Só mostra o que tem valor

  // Dados simulados para o Gráfico de Linha (Histórico é complexo para agora, mantemos visual)
  const lineData = [
    { month: "Jan", completed: completed > 0 ? completed : 0, pending: pending, inProgress: inProgress },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Visão geral da empresa</p>
          </div>
        </div>

        {/* CARDS COM NÚMEROS REAIS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Colaboradores</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : totalEmployees}
              </div>
              <p className="text-xs text-gray-500">Ativos na plataforma</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliações Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                 {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : completed}
              </div>
              <p className="text-xs text-gray-500">Neste ciclo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                 {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : inProgress}
              </div>
              <p className="text-xs text-gray-500">Aguardando conclusão</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                 {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : pending}
              </div>
              <p className="text-xs text-gray-500">Não iniciadas</p>
            </CardContent>
          </Card>
        </div>

        {/* GRÁFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Gráfico de Pizza (Status do Ciclo) */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Status Atual do Ciclo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full flex items-center justify-center">
                {totalEmployees === 0 ? (
                    <p className="text-gray-400 text-sm">Cadastre colaboradores para ver o gráfico</p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Atividade Recente (REAL) */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                    <p className="text-gray-500 text-sm py-4">Nenhuma avaliação registrada ainda.</p>
                ) : (
                    recentActivity.map((activity, i) => (
                        <div key={i} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                        <div>
                            <p className="font-medium text-gray-900">Avaliação de {activity.employeeName}</p>
                            <p className="text-sm text-gray-500">Atualizado: {activity.date}</p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                            ${activity.status === 'Concluído' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {activity.status}
                        </span>
                        </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}