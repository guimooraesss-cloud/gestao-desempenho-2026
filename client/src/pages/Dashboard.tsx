import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, CheckCircle, Clock, AlertCircle, Download, Filter, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc"; // <--- 1. Importamos a conexão com o servidor

// --- DADOS FAKES (MANTIDOS POR ENQUANTO PARA OS GRÁFICOS) ---
const mockEvaluationData = [
  { month: "Jan", completed: 12, pending: 8, inProgress: 5 },
  { month: "Fev", completed: 15, pending: 6, inProgress: 4 },
  { month: "Mar", completed: 18, pending: 4, inProgress: 3 },
  { month: "Abr", completed: 22, pending: 2, inProgress: 1 },
];

const mockCycleData = [
  { name: "Concluído", value: 45, fill: "#10b981" },
  { name: "Em Progresso", value: 30, fill: "#3b82f6" },
  { name: "Pendente", value: 25, fill: "#f59e0b" },
];

const DEPARTMENTS = ["RH", "TI", "Financeiro", "Operações", "Vendas", "Marketing"];
const LEADERS = ["João Silva", "Maria Santos", "Carlos Oliveira", "Ana Costa"];
const PERIODS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"];

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  
  // <--- 2. Buscamos os colaboradores reais do banco
  const { data: employees, isLoading } = trpc.employees.list.useQuery();
  
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    period: "",
    department: "",
    leader: "",
  });

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Você precisa estar autenticado para acessar o dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calcula o número real (ou 0 se estiver carregando)
  const totalEmployees = employees?.length || 0;

  const handleExportPDF = () => {
    const content = `
RELATÓRIO DE DESEMPENHO RH
Data: ${new Date().toLocaleDateString("pt-BR")}
Período: ${filters.period || "Todos"}

MÉTRICAS PRINCIPAIS:
- Total de Colaboradores: ${totalEmployees}
- Avaliações Concluídas: 156 (Simulado)
- Em Progresso: 62 (Simulado)

RESUMO:
Este relatório apresenta uma análise do ciclo de avaliações.
    `;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_dashboard_${new Date().getTime()}.txt`;
    a.click();
  };

  const handleExportExcel = () => {
    const csvContent = [
      ["Métrica", "Valor"],
      ["Total de Colaboradores", totalEmployees],
      ["Avaliações Concluídas", "156"],
      ["Em Progresso", "62"],
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dashboard_${new Date().getTime()}.csv`;
    a.click();
  };

  const clearFilters = () => {
    setFilters({ period: "", department: "", leader: "" });
  };

  const hasActiveFilters = filters.period || filters.department || filters.leader;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header com Filtros */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Bem-vindo, {user?.name || "Usuário"}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
            <Button onClick={handleExportPDF} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button onClick={handleExportExcel} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Excel
            </Button>
          </div>
        </div>

        {/* Filtros Avançados */}
        {showFilters && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Filtros Avançados</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Período */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                  <Select
                    value={filters.period}
                    onValueChange={(value) => setFilters({ ...filters, period: value })}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione um período" /></SelectTrigger>
                    <SelectContent>
                      {PERIODS.map((period) => (
                        <SelectItem key={period} value={period}>{period}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Departamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                  <Select
                    value={filters.department}
                    onValueChange={(value) => setFilters({ ...filters, department: value })}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione um departamento" /></SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Líder */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Líder</label>
                  <Select
                    value={filters.leader}
                    onValueChange={(value) => setFilters({ ...filters, leader: value })}
                  >
                    <SelectTrigger><SelectValue placeholder="Selecione um líder" /></SelectTrigger>
                    <SelectContent>
                      {LEADERS.map((leader) => (
                        <SelectItem key={leader} value={leader}>{leader}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-2 mt-4">
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="gap-2">
                    <X className="h-4 w-4" /> Limpar Filtros
                  </Button>
                )}
                <div className="flex-1" />
                <Button onClick={() => setShowFilters(false)}>Aplicar Filtros</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* --- CARD DE COLABORADORES REAL --- */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Colaboradores</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {isLoading ? (
                   <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                ) : (
                   totalEmployees // <--- 3. AQUI ESTÁ O NÚMERO REAL
                )}
              </div>
              <p className="text-xs text-gray-500">Ativos na plataforma</p>
            </CardContent>
          </Card>
          {/* ---------------------------------- */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avaliações Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-gray-500">Neste ciclo (Simulado)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">62</div>
              <p className="text-xs text-gray-500">Aguardando conclusão (Simulado)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">30</div>
              <p className="text-xs text-gray-500">Não iniciadas (Simulado)</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Evaluation Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Progresso de Avaliações</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockEvaluationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" name="Concluídas" />
                  <Line type="monotone" dataKey="inProgress" stroke="#3b82f6" name="Em Progresso" />
                  <Line type="monotone" dataKey="pending" stroke="#f59e0b" name="Pendentes" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cycle Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status do Ciclo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={mockCycleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockCycleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">Avaliação de João Silva</p>
                    <p className="text-sm text-gray-500">Concluída há 2 horas</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Concluído
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}