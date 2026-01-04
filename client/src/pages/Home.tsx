import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, Target, FileText, CheckCircle, LogOut } from "lucide-react";
import { useState } from "react";
import Dashboard from "./Dashboard";
import Employees from "./Employees";
import Evaluations from "./Evaluations";
import Positions from "./Positions";
import Competencies from "./Competencies";
import NineBox from "./NineBox";
import Reports from "./Reports";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Gestão de Desempenho RH</h1>
              <p className="text-sm text-gray-600">Bem-vindo, {user?.name || "Usuário"}</p>
            </div>
            <Button variant="outline" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </header>

        {/* Main Content with Tabs */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-8">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="employees" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Colaboradores</span>
              </TabsTrigger>
              <TabsTrigger value="evaluations" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Avaliações</span>
              </TabsTrigger>
              <TabsTrigger value="positions" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Cargos</span>
              </TabsTrigger>
              <TabsTrigger value="competencies" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Competências</span>
              </TabsTrigger>
              <TabsTrigger value="ninebox" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Nine Box</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Relatórios</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab Contents */}
            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard />
            </TabsContent>

            <TabsContent value="employees" className="space-y-6">
              <Employees />
            </TabsContent>

            <TabsContent value="evaluations" className="space-y-6">
              <Evaluations />
            </TabsContent>

            <TabsContent value="positions" className="space-y-6">
              <Positions />
            </TabsContent>

            <TabsContent value="competencies" className="space-y-6">
              <Competencies />
            </TabsContent>

            <TabsContent value="ninebox" className="space-y-6">
              <NineBox />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Reports />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Sistema de Gestão de Desempenho RH</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Bem-vindo ao sistema completo de gestão de desempenho e desenvolvimento de colaboradores.
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Autenticação Segura</p>
                <p className="text-sm text-gray-600">Login com OAuth integrado</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Metodologia Dinamizar</p>
                <p className="text-sm text-gray-600">100 créditos distribuíveis entre competências</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Hierarquia de Acesso</p>
                <p className="text-sm text-gray-600">Master, Leader e Employee</p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => window.location.href = "https://api.manus.im/oauth/authorize"}
            className="w-full"
            size="lg"
          >
            Fazer Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
