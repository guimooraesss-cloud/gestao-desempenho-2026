import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input"; // Importei o componente de Input
import { BarChart3, Users, Target, FileText, CheckCircle, LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/trpc"; // Conexão com o backend
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

  // --- LÓGICA DE LOGIN ---
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const loginMutation = api.auth.login.useMutation();

  const handleLogin = async () => {
    if (!email) return;
    setError("");

    try {
      // Chama o backend para criar o cookie de sessão
      await loginMutation.mutateAsync({ email });
      // Recarrega a página para o sistema "perceber" que você entrou
      window.location.reload();
    } catch (e) {
      setError("Acesso negado. Email não encontrado ou incorreto.");
    }
  };
  // -----------------------

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Gestão de Desempenho RH</h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">Bem-vindo, {user?.name || "Usuário"}</p>
                {user?.role === 'master' && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">Master</span>
                )}
              </div>
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
            <TabsList className="grid w-full grid-cols-7 mb-8 overflow-x-auto">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="employees" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">Colaboradores</span>
              </TabsTrigger>
              <TabsTrigger value="evaluations" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden md:inline">Avaliações</span>
              </TabsTrigger>
              <TabsTrigger value="positions" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline">Cargos</span>
              </TabsTrigger>
              <TabsTrigger value="competencies" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span className="hidden md:inline">Competências</span>
              </TabsTrigger>
              <TabsTrigger value="ninebox" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">9-Box</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden md:inline">Relatórios</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6"><Dashboard /></TabsContent>
            <TabsContent value="employees" className="space-y-6"><Employees /></TabsContent>
            <TabsContent value="evaluations" className="space-y-6"><Evaluations /></TabsContent>
            <TabsContent value="positions" className="space-y-6"><Positions /></TabsContent>
            <TabsContent value="competencies" className="space-y-6"><Competencies /></TabsContent>
            <TabsContent value="ninebox" className="space-y-6"><NineBox /></TabsContent>
            <TabsContent value="reports" className="space-y-6"><Reports /></TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  // TELA DE LOGIN (Modificada)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Gestão de Desempenho 2026</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-gray-600">Acesse com seu email corporativo</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="seu.email@empresa.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
            </div>

            <Button 
              onClick={handleLogin} 
              className="w-full" 
              size="lg"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Acessar Sistema"
              )}
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-100">
             <div className="text-xs text-gray-500 text-center space-y-1">
                <p>Ambiente Seguro • Acesso Controlado</p>
                <p className="opacity-70">Para acesso administrativo, use seu email cadastrado.</p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}