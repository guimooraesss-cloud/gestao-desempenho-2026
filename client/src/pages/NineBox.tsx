import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Edit2, Download } from "lucide-react";

interface NineBoxEmployee {
  id: number;
  name: string;
  position: string;
  performance: number; // 1-3
  potential: number; // 1-3
  classification: string;
  strengths: string[];
  improvementAreas: string[];
  feedback: string;
}

const mockNineBoxData: NineBoxEmployee[] = [
  {
    id: 1,
    name: "João Silva",
    position: "Desenvolvedor Sênior",
    performance: 3,
    potential: 3,
    classification: "Alto Potencial - Alto Desempenho",
    strengths: ["Comunicação", "Liderança", "Integridade"],
    improvementAreas: ["Pensamento Estratégico"],
    feedback: "João é um colaborador excepcional com alto desempenho e grande potencial de crescimento. Recomenda-se investir em seu desenvolvimento para futuras posições de liderança.",
  },
  {
    id: 2,
    name: "Maria Santos",
    position: "Gerente de Projetos",
    performance: 3,
    potential: 2,
    classification: "Especialista - Alto Desempenho",
    strengths: ["Resultados", "Técnica", "Liderança"],
    improvementAreas: ["Pensamento Estratégico"],
    feedback: "Maria é uma especialista em sua área com excelente desempenho. Seu potencial é moderado, sendo ideal para aprofundamento técnico.",
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    position: "Analista Junior",
    performance: 2,
    potential: 3,
    classification: "Promissor - Desempenho Moderado",
    strengths: ["Comunicação", "Integridade"],
    improvementAreas: ["Resultados", "Técnica"],
    feedback: "Carlos mostra grande potencial de desenvolvimento. Recomenda-se programa de mentoria e treinamento técnico.",
  },
];

const NINE_BOX_MATRIX = {
  1: { low: "Baixo Potencial", medium: "Moderado Potencial", high: "Alto Potencial" },
  2: { low: "Moderado Desempenho", medium: "Moderado Desempenho", high: "Moderado Desempenho" },
  3: { low: "Alto Desempenho", medium: "Alto Desempenho", high: "Alto Desempenho" },
};

export default function NineBox() {
  const [selectedEmployee, setSelectedEmployee] = useState<NineBoxEmployee | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleExportPDF = () => {
    const content = `RELATÓRIO NINE BOX\nData: ${new Date().toLocaleDateString("pt-BR")}\n\n${mockNineBoxData.map(e => `${e.name} - ${e.classification}`).join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nine_box_${new Date().getTime()}.txt`;
    a.click();
  };

  const handleExportExcel = () => {
    const csvContent = [["Nome", "Cargo", "Classificação"], ...mockNineBoxData.map(e => [e.name, e.position, e.classification])].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nine_box_${new Date().getTime()}.csv`;
    a.click();
  };

  const handleOpenFeedback = (employee: NineBoxEmployee) => {
    setSelectedEmployee(employee);
    setFeedback(employee.feedback);
    setIsDialogOpen(true);
  };

  const handleSaveFeedback = () => {
    if (selectedEmployee) {
      selectedEmployee.feedback = feedback;
    }
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Nine Box - Matriz de Desempenho</h1>
            <p className="text-gray-600 mt-1">Visualização de desempenho vs potencial dos colaboradores</p>
          </div>
          <div className="flex gap-2">
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

        {/* Nine Box Matrix Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Row 1: Alto Potencial */}
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-sm">Baixo Desempenho<br />Alto Potencial</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">Promissores - Investir em desenvolvimento</p>
              {mockNineBoxData
                .filter(e => e.performance === 1 && e.potential === 3)
                .map(emp => (
                  <div key={emp.id} className="bg-white p-2 rounded mb-2 text-xs">
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-gray-600">{emp.position}</p>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-sm">Desempenho Moderado<br />Potencial Moderado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">Núcleo - Manter e desenvolver</p>
              {mockNineBoxData
                .filter(e => e.performance === 2 && e.potential === 2)
                .map(emp => (
                  <div key={emp.id} className="bg-white p-2 rounded mb-2 text-xs">
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-gray-600">{emp.position}</p>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-sm">Alto Desempenho<br />Alto Potencial</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">Talentos - Alto Potencial</p>
              {mockNineBoxData
                .filter(e => e.performance === 3 && e.potential === 3)
                .map(emp => (
                  <div key={emp.id} className="bg-white p-2 rounded mb-2 text-xs">
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-gray-600">{emp.position}</p>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Row 2: Potencial Moderado */}
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-sm">Baixo Desempenho<br />Potencial Moderado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">Em Desenvolvimento</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm">Desempenho Moderado<br />Potencial Moderado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">Núcleo Estável</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-300 bg-blue-100">
            <CardHeader>
              <CardTitle className="text-sm">Alto Desempenho<br />Potencial Moderado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">Especialistas</p>
              {mockNineBoxData
                .filter(e => e.performance === 3 && e.potential === 2)
                .map(emp => (
                  <div key={emp.id} className="bg-white p-2 rounded mb-2 text-xs">
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-gray-600">{emp.position}</p>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Row 3: Baixo Potencial */}
          <Card className="border-2 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-sm">Baixo Desempenho<br />Baixo Potencial</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">Reposicionar</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-sm">Desempenho Moderado<br />Baixo Potencial</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">Manutenção</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-sm">Alto Desempenho<br />Baixo Potencial</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-600 mb-3">Especialistas Sênior</p>
            </CardContent>
          </Card>
        </div>

        {/* PDI Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Plano de Desenvolvimento Individual (PDI)</h2>
          <div className="space-y-4">
            {mockNineBoxData.map((employee) => (
              <Card key={employee.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{employee.position}</p>
                  </div>
                  <Dialog open={isDialogOpen && selectedEmployee?.id === employee.id} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleOpenFeedback(employee)}
                      >
                        <Edit2 className="h-4 w-4" />
                        Editar Feedback
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Feedback Formalizado - {employee.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Descreva o feedback formalizado..."
                          rows={6}
                        />
                        <div className="flex gap-3 justify-end">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                          <Button onClick={handleSaveFeedback}>Salvar Feedback</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Pontos Fortes:</h4>
                      <ul className="space-y-1">
                        {employee.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Áreas de Melhoria:</h4>
                      <ul className="space-y-1">
                        {employee.improvementAreas.map((area, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex gap-2">
                      <FileText className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Feedback Formalizado:</p>
                        <p className="text-sm text-gray-700 mt-1">{employee.feedback}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
