# Sistema de Gestão de Desempenho RH - TODO

## Fase 1: Inicialização e Banco de Dados
- [x] Inicializar projeto web com tRPC, banco de dados e autenticação
- [x] Estruturar schema do banco de dados com todas as tabelas necessárias
- [x] Criar tabelas: users, employees, positions, competencies, evaluations, pdi, nine_box
- [x] Implementar migrations e validações de schema

## Fase 2: Autenticação e Permissões
- [x] Implementar autenticação por e-mail e senha (além de OAuth)
- [x] Criar sistema de roles (master, leader, employee)
- [x] Implementar controle de permissões hierárquicas (master → leader → employee)
- [x] Criar procedures protegidas para cada nível de acesso

## Fase 3: Dashboard Principal
- [x] Construir layout principal com sidebar de navegação
- [x] Criar dashboard com métricas de ciclos de avaliação
- [x] Implementar cards de indicadores (avaliações pendentes, concluídas, etc)
- [x] Adicionar gráficos de progresso dos ciclos

## Fase 4: Módulo de Cargos
- [x] Criar CRUD de Descrição de Cargo
- [x] Implementar campos: título, descrição, requisitos
- [x] Adicionar seleção de competências (até 7 categorias)
- [x] Criar interface para gerenciar competências por cargo

## Fase 5: Módulo de Competências
- [x] Criar CRUD de Competências
- [x] Implementar categorias: Cultural/Core, Soft Skill (Atitude), Soft Skill (Relacional), Soft Skill (Distintiva), Hard Skill (Técnica), Results Skill, Liderança
- [x] Adicionar filtros por categoria
- [x] Implementar relacionamento com descrições de cargo

## Fase 6: Cadastro de Colaboradores
- [x] Criar CRUD de Colaboradores
- [x] Implementar campos: nome, cra chá, setor, e-mail, CPF, cargo, data nascimento, data admissão
- [x] Adicionar sistema de permissões de conta
- [x] Implementar vinculação líder-liderado
- [x] Adicionar registro de último acesso

## Fase 7: Sistema de Avaliação (Metodologia Dinamizar)
- [x] Criar estrutura de avaliação com 100 créditos
- [x] Implementar distribuição de créditos entre 6-7 competências
- [x] Criar cálculo de média ponderada (peso × nota)
- [x] Implementar validação de distribuição de créditos
- [x] Criar interface de avaliação para líderes

## Fase 8: PDI e Nine Box
- [x] Implementar geração automática de PDI baseado em melhores/piores notas
- [x] Criar seção de feedbacks formalizados
- [x] Implementar visualização Nine Box (matriz 9 quadrantes)
- [x] Criar cálculo de enquadramento (desempenho × potencial)

## Fase 9: Exportação de Dados
- [x] Implementar exportação em Excel (avaliações, PDI, Nine Box)
- [x] Implementar exportação em PDF (relatórios formatados)
- [x] Adicionar filtros de data e colaborador
- [x] Testar qualidade dos relatórios

## Fase 10: Controle de Visibilidade e Testes
- [x] Implementar filtros de visibilidade por hierarquia
- [x] Garantir que líderes veem apenas seus liderados
- [x] Garantir que master vê tudo
- [x] Criar testes unitários (vitest) para procedures críticas
- [x] Testar fluxos completos de avaliação

## Fase 11: Entrega
- [x] Revisar todas as funcionalidades
- [x] Corrigir página inicial com navegação
- [x] Criar checkpoint final
- [ ] Documentar sistema e instruções de uso
- [ ] Entregar ao usuário

## Ajustes Solicitados
- [x] Dashboard aparecer como conteúdo principal na tela inicial
- [x] Colaboradores, Avaliações, Cargos, Competências, Nine Box como abas na sidebar
- [x] Corrigir erro na aba de Competências

## Novas Funcionalidades
- [x] Filtros avançados no Dashboard (período, departamento, líder)
- [x] Exportação em PDF para todas as abas de dados
- [x] Exportação em Excel para todas as abas de dados
- [x] Revisão geral de códigos e qualidade


## Bugs Encontrados
- [x] Aba Competências com erro de JSX (fechamento de tags)
- [x] Aba Positions com erro de JSX (fechamento de tags)
- [x] Aba Evaluations com erro de JSX (fechamento de tags)
- [x] Revisar e corrigir todas as abas com problemas de renderização


## Nova Funcionalidade - Sistema de Níveis de Acesso
- [x] Adicionar campo "accessLevel" (Premium/Pleno) na interface Employee
- [x] Adicionar Select de tipo de acesso no formulário de cadastro
- [x] Exibir tipo de acesso na tabela de colaboradores
- [x] Implementar lógica de controle de visibilidade por tipo de acesso
- [x] Atualizar schema do banco de dados com campo accessLevel
- [x] Testar funcionalidade de acesso Premium e Pleno
