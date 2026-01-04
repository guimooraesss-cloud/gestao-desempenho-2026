import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, FileText, Table } from "lucide-react";

export default function Reports() {
  const [reportType, setReportType] = useState("evaluations");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [employee, setEmployee] = useState("");

  const handleExportExcel = () => {
    console.log("Exportando para Excel...", { reportType, dateFrom, dateTo, employee });
    // Implementar exportação para Excel
  };

  const handleExportPDF = () => {
    console.log("Exportando para PDF...", { reportType, dateFrom, dateTo, employee });
    // Implementar exportação para PDF
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exportação de Relatórios</h1>
          <p className="text-gray-600 mt-1">Gere relatórios em Excel e PDF com os dados de avaliações</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros de Relatório</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Relatório</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="evaluations">Avaliações de Desempenho</SelectItem>
                    <SelectItem value="pdi">Planos de Desenvolvimento Individual</SelectItem>
                    <SelectItem value="nine-box">Matriz Nine Box</SelectItem>
                    <SelectItem value="competencies">Competências</SelectItem>
                    <SelectItem value="complete">Relatório Completo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Colaborador</label>
                <Input
                  value={employee}
                  onChange={(e) => setEmployee(e.target.value)}
                  placeholder="Deixe em branco para todos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Table className="h-5 w-5 text-blue-600" />
                <CardTitle>Exportar para Excel</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700">
                Exporte os dados em formato Excel (.xlsx) para análise e edição em planilhas.
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>✓ Dados estruturados em abas</li>
                <li>✓ Gráficos e formatação</li>
                <li>✓ Compatível com Excel e Google Sheets</li>
              </ul>
              <Button onClick={handleExportExcel} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                <FileDown className="h-4 w-4" />
                Exportar Excel
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-600" />
                <CardTitle>Exportar para PDF</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700">
                Exporte os dados em formato PDF para visualização e impressão profissional.
              </p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>✓ Formatação profissional</li>
                <li>✓ Pronto para impressão</li>
                <li>✓ Protegido e seguro</li>
              </ul>
              <Button onClick={handleExportPDF} className="w-full gap-2 bg-red-600 hover:bg-red-700">
                <FileDown className="h-4 w-4" />
                Exportar PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sample Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">Avaliações de Desempenho - Janeiro 2024</p>
                  <p className="text-xs text-gray-600">248 colaboradores avaliados</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Excel</Button>
                  <Button variant="outline" size="sm">PDF</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">Matriz Nine Box - Dezembro 2023</p>
                  <p className="text-xs text-gray-600">Classificação de desempenho e potencial</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Excel</Button>
                  <Button variant="outline" size="sm">PDF</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">PDI - Planos de Desenvolvimento</p>
                  <p className="text-xs text-gray-600">Todos os planos de desenvolvimento individual</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Excel</Button>
                  <Button variant="outline" size="sm">PDF</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium text-gray-900">Análise de Competências</p>
                  <p className="text-xs text-gray-600">Distribuição de competências por setor</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Excel</Button>
                  <Button variant="outline" size="sm">PDF</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
