import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, CheckCircle, Download } from "lucide-react";

interface CompetencyScore {
  competencyId: number;
  name: string;
  weight: number; // 0-100 (credit allocation)
  score: number; // 1-5
  weightedScore: number; // (weight/100) * score
}

interface Evaluation {
  id: number;
  employeeName: string;
  evaluator: string;
  status: "draft" | "submitted" | "completed";
  competencies: CompetencyScore[];
  totalScore: number;
  createdAt: string;
}

const COMPETENCIES = [
  { id: 1, name: "Comunicação", category: "Soft Skill (Relacional)" },
  { id: 2, name: "Liderança", category: "Liderança" },
  { id: 3, name: "Integridade", category: "Cultural/Core" },
  { id: 4, name: "Pensamento Estratégico", category: "Soft Skill (Distintiva)" },
  { id: 5, name: "Resultados", category: "Results Skill" },
  { id: 6, name: "Técnica", category: "Hard Skill (Técnica)" },
];

const mockEvaluations: Evaluation[] = [
  {
    id: 1,
    employeeName: "João Silva",
    evaluator: "Maria Santos",
    status: "completed",
    competencies: [
      { competencyId: 1, name: "Comunicação", weight: 20, score: 4, weightedScore: 0.8 },
      { competencyId: 2, name: "Liderança", weight: 15, score: 3, weightedScore: 0.45 },
      { competencyId: 3, name: "Integridade", weight: 25, score: 5, weightedScore: 1.25 },
      { competencyId: 4, name: "Pensamento Estratégico", weight: 15, score: 4, weightedScore: 0.6 },
      { competencyId: 5, name: "Resultados", weight: 20, score: 5, weightedScore: 1.0 },
      { competencyId: 6, name: "Técnica", weight: 5, score: 4, weightedScore: 0.2 },
    ],
    totalScore: 4.3,
    createdAt: "2024-01-02",
  },
];

export default function Evaluations() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>(mockEvaluations);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleExportPDF = () => {
    const content = `RELATÓRIO DE AVALIAÇÕES\nData: ${new Date().toLocaleDateString("pt-BR")}\n\n${evaluations.map(e => `${e.employeeName} - Avaliador: ${e.evaluator} - Pontuação: ${e.totalScore.toFixed(2)}`).join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avaliacoes_${new Date().getTime()}.txt`;
    a.click();
  };

  const handleExportExcel = () => {
    const csvContent = [["Colaborador", "Avaliador", "Pontuação Total", "Data"], ...evaluations.map(e => [e.employeeName, e.evaluator, e.totalScore.toFixed(2), e.createdAt])].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avaliacoes_${new Date().getTime()}.csv`;
    a.click();
  };

  const [formData, setFormData] = useState({
    employeeName: "",
    competencies: COMPETENCIES.map(c => ({
      competencyId: c.id,
      name: c.name,
      weight: 0,
      score: 3,
      weightedScore: 0,
    })),
  });

  const totalWeight = formData.competencies.reduce((sum, c) => sum + c.weight, 0);

  const handleWeightChange = (index: number, value: number) => {
    const newCompetencies = [...formData.competencies];
    newCompetencies[index].weight = value;
    newCompetencies[index].weightedScore = (value / 100) * newCompetencies[index].score;
    setFormData({ ...formData, competencies: newCompetencies });
  };

  const handleScoreChange = (index: number, value: number) => {
    const newCompetencies = [...formData.competencies];
    newCompetencies[index].score = value;
    newCompetencies[index].weightedScore = (newCompetencies[index].weight / 100) * value;
    setFormData({ ...formData, competencies: newCompetencies });
  };

  const handleSave = () => {
    const totalScore = formData.competencies.reduce((sum, c) => sum + c.weightedScore, 0);
    const newEvaluation: Evaluation = {
      id: editingId || Date.now(),
      employeeName: formData.employeeName,
      evaluator: "Você",
      status: "completed",
      competencies: formData.competencies,
      totalScore,
      createdAt: new Date().toISOString().split("T")[0],
    };

    if (editingId) {
      setEvaluations(evaluations.map(e => e.id === editingId ? newEvaluation : e));
      setEditingId(null);
    } else {
      setEvaluations([...evaluations, newEvaluation]);
    }

    setFormData({
      employeeName: "",
      competencies: COMPETENCIES.map(c => ({
        competencyId: c.id,
        name: c.name,
        weight: 0,
        score: 3,
        weightedScore: 0,
      })),
    });
    setIsOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Avaliações de Desempenho</h1>
            <p className="text-gray-600 mt-1">Metodologia Dinamizar - 100 créditos para distribuir</p>
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
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nova Avaliação
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nova Avaliação de Desempenho</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Colaborador</label>
                    <Input
                      value={formData.employeeName}
                      onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                      placeholder="Nome do colaborador"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">Distribuição de Créditos (100 pontos)</h3>
                      <span className={`text-sm font-medium ${totalWeight === 100 ? "text-green-600" : "text-red-600"}`}>
                        {totalWeight}/100
                      </span>
                    </div>

                    <div className="space-y-6">
                      {formData.competencies.map((comp, index) => (
                        <Card key={comp.competencyId}>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <label className="font-medium text-gray-900">{comp.name}</label>
                                  <span className="text-sm text-gray-600">{comp.weight} pontos</span>
                                </div>
                                <Slider
                                  value={[comp.weight]}
                                  onValueChange={(value) => handleWeightChange(index, value[0])}
                                  max={100}
                                  step={5}
                                  className="w-full"
                                />
                              </div>

                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <label className="font-medium text-gray-900">Nota (1-5)</label>
                                  <span className="text-sm text-gray-600">{comp.score}</span>
                                </div>
                                <Slider
                                  value={[comp.score]}
                                  onValueChange={(value) => handleScoreChange(index, value[0])}
                                  min={1}
                                  max={5}
                                  step={1}
                                  className="w-full"
                                />
                              </div>

                              <div className="bg-blue-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Pontuação Ponderada:</span> {comp.weightedScore.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <p className="text-lg font-bold text-green-900">
                        Pontuação Total: {formData.competencies.reduce((sum, c) => sum + c.weightedScore, 0).toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={totalWeight !== 100}>
                      Salvar Avaliação
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Evaluations List */}
        <div className="space-y-4">
          {evaluations.map((evaluation) => (
            <Card key={evaluation.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">{evaluation.employeeName}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Avaliador: {evaluation.evaluator}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{evaluation.totalScore.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Pontuação Final</p>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {evaluation.status === "completed" ? "Concluído" : "Rascunho"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {evaluation.competencies.map((comp) => (
                    <div key={comp.competencyId} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{comp.name}</p>
                      <p className="text-xs text-gray-600 mt-1">Peso: {comp.weight}%</p>
                      <p className="text-xs text-gray-600">Nota: {comp.score}/5</p>
                      <p className="text-sm font-bold text-blue-600 mt-2">{comp.weightedScore.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
