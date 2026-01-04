import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Filter, Download } from "lucide-react";

interface Competency {
  id: number;
  name: string;
  description: string;
  category: string;
}

const CATEGORIES = [
  "Cultural/Core",
  "Soft Skill (Atitude)",
  "Soft Skill (Relacional)",
  "Soft Skill (Distintiva)",
  "Hard Skill (Técnica)",
  "Results Skill",
  "Liderança"
];

const mockCompetencies: Competency[] = [
  {
    id: 1,
    name: "Integridade",
    description: "Agir com honestidade e transparência",
    category: "Cultural/Core",
  },
  {
    id: 2,
    name: "Comunicação",
    description: "Expressar ideias de forma clara e objetiva",
    category: "Soft Skill (Relacional)",
  },
  {
    id: 3,
    name: "Pensamento Estratégico",
    description: "Visão de longo prazo e planejamento",
    category: "Soft Skill (Distintiva)",
  },
];

export default function Competencies() {
  const [competencies, setCompetencies] = useState<Competency[]>(mockCompetencies);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", category: "" });

  const handleExportPDF = () => {
    const content = `RELATÓRIO DE COMPETÊNCIAS\nData: ${new Date().toLocaleDateString("pt-BR")}\n\n${competencies.map(c => `${c.name} (${c.category})\n${c.description}`).join("\n\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `competencias_${new Date().getTime()}.txt`;
    a.click();
  };

  const handleExportExcel = () => {
    const csvContent = [["Nome", "Categoria", "Descrição"], ...competencies.map(c => [c.name, c.category, c.description])].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `competencias_${new Date().getTime()}.csv`;
    a.click();
  };

  const filtered = selectedCategory
    ? competencies.filter(c => c.category === selectedCategory)
    : competencies;

  const handleAdd = () => {
    if (!formData.name || !formData.category || !formData.description) {
      alert("Por favor, preencha todos os campos");
      return;
    }
    if (editingId) {
      setCompetencies(competencies.map(c => c.id === editingId ? { ...c, ...formData } : c));
      setEditingId(null);
    } else {
      setCompetencies([...competencies, { id: Date.now(), ...formData }]);
    }
    setFormData({ name: "", description: "", category: "" });
    setIsOpen(false);
  };

  const handleEdit = (competency: Competency) => {
    setFormData(competency);
    setEditingId(competency.id);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    setCompetencies(competencies.filter(c => c.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Competências</h1>
            <p className="text-gray-600 mt-1">Gerencie as competências organizacionais</p>
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
                Nova Competência
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Competência" : "Nova Competência"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Comunicação"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva a competência"
                    rows={4}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                  <Button onClick={handleAdd}>Salvar</Button>
                </div>
              </div>
            </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <CardTitle className="text-base">Filtrar por Categoria</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Select value={selectedCategory || "all"} onValueChange={(val) => setSelectedCategory(val === "all" ? "" : val)}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Competencies Grid */}
        <div className="grid gap-4">
          {filtered.map((competency) => (
            <Card key={competency.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">{competency.name}</CardTitle>
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {competency.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(competency)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(competency.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{competency.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
