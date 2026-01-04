import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Download } from "lucide-react";

interface Position {
  id: number;
  title: string;
  description: string;
  requirements: string;
}

const mockPositions: Position[] = [
  {
    id: 1,
    title: "Gerente de Projetos",
    description: "Responsável pela gestão de projetos estratégicos",
    requirements: "5+ anos de experiência em gestão de projetos",
  },
  {
    id: 2,
    title: "Desenvolvedor Sênior",
    description: "Desenvolvimento de soluções tecnológicas",
    requirements: "7+ anos de experiência em desenvolvimento",
  },
];

export default function Positions() {
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", requirements: "" });

  const handleExportPDF = () => {
    const content = `RELATÓRIO DE CARGOS\nData: ${new Date().toLocaleDateString("pt-BR")}\n\n${positions.map(p => `${p.title}\nDescrição: ${p.description}\nRequisitos: ${p.requirements}\n`).join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cargos_${new Date().getTime()}.txt`;
    a.click();
  };

  const handleExportExcel = () => {
    const csvContent = [["Título", "Descrição", "Requisitos"], ...positions.map(p => [p.title, p.description, p.requirements])].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cargos_${new Date().getTime()}.csv`;
    a.click();
  };

  const handleAdd = () => {
    if (editingId) {
      setPositions(positions.map(p => p.id === editingId ? { ...p, ...formData } : p));
      setEditingId(null);
    } else {
      setPositions([...positions, { id: Date.now(), ...formData }]);
    }
    setFormData({ title: "", description: "", requirements: "" });
    setIsOpen(false);
  };

  const handleEdit = (position: Position) => {
    setFormData(position);
    setEditingId(position.id);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    setPositions(positions.filter(p => p.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Descrição de Cargos</h1>
            <p className="text-gray-600 mt-1">Gerencie os cargos e suas competências</p>
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
                Novo Cargo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingId ? "Editar Cargo" : "Novo Cargo"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título do Cargo</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Gerente de Projetos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva as responsabilidades do cargo"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requisitos</label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    placeholder="Descreva os requisitos necessários"
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

        <div className="grid gap-4">
          {positions.map((position) => (
            <Card key={position.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-xl">{position.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-2">{position.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(position)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(position.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Requisitos:</h4>
                  <p className="text-sm text-gray-600">{position.requirements}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
