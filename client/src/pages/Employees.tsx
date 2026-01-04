import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Clock, Download } from "lucide-react";

interface Employee {
  id: number;
  name: string;
  badge: string;
  sector: string;
  email: string;
  cpf: string;
  position: string;
  birthDate: string;
  admissionDate: string;
  leader?: string;
  lastAccess?: string;
  accessLevel: "premium" | "pleno";
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "João Silva",
    badge: "EMP001",
    sector: "TI",
    email: "joao@company.com",
    cpf: "123.456.789-00",
    position: "Desenvolvedor Sênior",
    birthDate: "1990-05-15",
    admissionDate: "2020-01-10",
    leader: "Maria Santos",
    lastAccess: "2024-01-03 14:30",
    accessLevel: "pleno",
  },
  {
    id: 2,
    name: "Maria Santos",
    badge: "EMP002",
    sector: "TI",
    email: "maria@company.com",
    cpf: "987.654.321-00",
    position: "Gerente de Projetos",
    birthDate: "1988-03-20",
    admissionDate: "2019-06-15",
    lastAccess: "2024-01-03 15:45",
    accessLevel: "premium",
  },
];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    badge: "",
    sector: "",
    email: "",
    cpf: "",
    position: "",
    birthDate: "",
    admissionDate: "",
    leader: "",
    accessLevel: ("pleno" as "premium" | "pleno"),
  });

  const handleExportPDF = () => {
    const content = `RELATÓRIO DE COLABORADORES\nData: ${new Date().toLocaleDateString("pt-BR")}\n\n${employees.map(e => `${e.name} - ${e.position} - ${e.sector}`).join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `colaboradores_${new Date().getTime()}.txt`;
    a.click();
  };

  const handleExportExcel = () => {
    const csvContent = [
      ["Nome", "Crachá", "Setor", "E-mail", "CPF", "Cargo", "Data Nascimento", "Data Admissão", "Líder", "Último Acesso"],
      ...employees.map(e => [
        e.name,
        e.badge,
        e.sector,
        e.email,
        e.cpf,
        e.position,
        e.birthDate,
        e.admissionDate,
        e.leader || "-",
        e.lastAccess || "-",
      ]),
    ]
      .map(row => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `colaboradores_${new Date().getTime()}.csv`;
    a.click();
  };

  const handleAdd = () => {
    if (editingId) {
      setEmployees(employees.map(e => (e.id === editingId ? { ...e, ...formData } : e)));
      setEditingId(null);
    } else {
      setEmployees([...employees, { id: Date.now(), ...formData }]);
    }
    setFormData({
      name: "",
      badge: "",
      sector: "",
      email: "",
      cpf: "",
      position: "",
      accessLevel: "pleno",
      birthDate: "",
      admissionDate: "",
      leader: "",
    });
    setIsOpen(false);
  };

  const handleEdit = (employee: Employee) => {
    setFormData({
      name: employee.name,
      badge: employee.badge,
      sector: employee.sector,
      email: employee.email,
      cpf: employee.cpf,
      position: employee.position,
      birthDate: employee.birthDate,
      admissionDate: employee.admissionDate,
      leader: employee.leader || "",
      accessLevel: employee.accessLevel,
    });
    setEditingId(employee.id);
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Colaboradores</h1>
            <p className="text-gray-600 mt-1">Gerencie dados e permissões de colaboradores</p>
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
                  Novo Colaborador
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Editar Colaborador" : "Novo Colaborador"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Crachá</label>
                      <Input
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        placeholder="EMP001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
                      <Input
                        value={formData.sector}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        placeholder="TI, RH, etc"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@company.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                      <Input
                        value={formData.cpf}
                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                        placeholder="123.456.789-00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                      <Input
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="Desenvolvedor Sênior"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                      <Input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Admissão</label>
                      <Input
                        type="date"
                        value={formData.admissionDate}
                        onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Líder</label>
                      <Input
                        value={formData.leader}
                        onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                        placeholder="Nome do líder"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Acesso</label>
                      <Select value={formData.accessLevel} onValueChange={(val) => setFormData({ ...formData, accessLevel: val as "premium" | "pleno" })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pleno">Pleno - Acesso restrito</SelectItem>
                          <SelectItem value="premium">Premium - Acesso total</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.accessLevel === "premium" ? "Acesso a todas as funções do sistema" : "Acesso apenas ao seu perfil e avaliações de liderados"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAdd}>Salvar</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Employees Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 font-semibold">Nome</th>
                    <th className="text-left py-2 px-4 font-semibold">Crachá</th>
                    <th className="text-left py-2 px-4 font-semibold">Setor</th>
                    <th className="text-left py-2 px-4 font-semibold">Cargo</th>
                    <th className="text-left py-2 px-4 font-semibold">Líder</th>
                    <th className="text-left py-2 px-4 font-semibold">Nível de Acesso</th>
                    <th className="text-left py-2 px-4 font-semibold">Último Acesso</th>
                    <th className="text-left py-2 px-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{employee.name}</td>
                      <td className="py-3 px-4">{employee.badge}</td>
                      <td className="py-3 px-4">{employee.sector}</td>
                      <td className="py-3 px-4">{employee.position}</td>
                      <td className="py-3 px-4">{employee.leader || "-"}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          employee.accessLevel === "premium"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {employee.accessLevel === "premium" ? "Premium" : "Pleno"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="h-3 w-3" />
                          {employee.lastAccess || "Nunca"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(employee)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(employee.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
