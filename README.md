# 🩸 Blood Hub - Plataforma de Gestão de Doação de Sangue

Este projeto é uma plataforma moderna e responsiva para a gestão de doações de sangue, desenvolvida como proposta para o final do curso de Engenharia Informática. O sistema unifica o ecossistema de doação, conectando **Doadores** e **Hospitais** em um único ambiente digital.

---

## 🛠️ Stack Tecnológica

O projeto foi transformado de um protótipo HTML/CSS simples para uma aplicação **Enterprise-Ready** utilizando:

- **React 18 & TypeScript:** Base sólida e tipagem estática para evitar erros em produção.
- **Zustand:** Gerenciamento de estado global ultra-rápido para Autenticação e Inventário.
- **Zod & React Hook Form:** Validação rigorosa de formulários e integridade de dados.
- **TanStack Query (React Query):** Sincronização de dados e cache inteligente.
- **Shadcn UI & Tailwind CSS:** Interface premium, seguindo padrões modernos de design e acessibilidade.
- **Lucide React & React Icons:** Biblioteca de ícones consistente.

---

## 🏗️ Arquitetura do Projeto

A aplicação segue uma arquitetura baseada em **Separação de Responsabilidades** e **Componentização**:

- **`/src/components`**: Componentes reutilizáveis (UI) e Layouts de área.
- **`/src/pages`**: View Components que representam cada tela do sistema.
- **`/src/stores`**: Lógica de estado persistente (Single Source of Truth).
- **`/src/lib`**: Schemas de validação, utilitários e definições de tipos.
- **`/src/auth`**: Guardas de rota para proteção de acesso baseado em papel (Role-based access).

---

## 🔄 Fluxo de Navegação e Funcionalidades

### 👥 Área do Doador (Mobile-First)
Focada na experiência do voluntário, com layout otimizado para dispositivos móveis.

1.  **Onboarding (Login/Registro):** Criação de perfil com tipo sanguíneo e credenciais seguras.
2.  **Dashboard:** Visualização do status de elegibilidade para doação, estatísticas de impacto ("Vidas Salvas") e ranking de doador.
3.  **Hospitals & Centers:** Busca interativa de centros de coleta próximos com filtros de urgência e distância.
4.  **Appointments:** Histórico completo de doações passadas e gestão de agendamentos futuros.
5.  **Profile:** Gestão de dados pessoais e configurações de conta.

### 🏥 Área do Hospital (Desktop-Optimized)
Painel administrativo robusto para gestão técnica do banco de sangue.

1.  **Admin Dashboard:** Visão geral da telemetria do banco de sangue (Total de unidades, necessidades urgentes).
2.  **Blood Stock:** Controle granular do inventário para todos os tipos sanguíneos (A+, O-, etc.) com alertas visuais de estoque crítico.
3.  **Donor Network:** Acesso à base de dados de doadores cadastrados, facilitando a convocação em casos de emergência.
4.  **Blood Requests:** Sistema para criação de requisições emergenciais de sangue entre centros.
5.  **AI Suggestions:** Sugestões inteligentes (mockeadas) para otimização de estoque baseadas na demanda.

---

## 🎨 Diferenciais da Interface (Premium UI)

- **Modo Escuro (Dark Mode):** Alternância inteligente de tema em toda a aplicação.
- **Glassmorphism:** Uso de efeitos de transparência e desfoque de fundo para um visual sofisticado.
- **Micro-animações:** Transições suaves entre páginas e estados para melhorar a UX (User Experience).
- **Responsividade Total:** Adaptação fluida desde smartphones até monitores ultra-wide.

---

## 🚀 Como Executar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. O projeto estará disponível na URL indicada no terminal.

---

**Desenvolvido como projeto final de Engenharia Informática.**
"Doar sangue é um ato de amor, gerir com eficiência é um dever técnico."