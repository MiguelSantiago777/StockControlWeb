# StockControl — Frontend

Frontend do Sistema de Controle de Estoque e Entregas em Tempo Real, em **Next.js 15 (App Router) + React 19 + TypeScript**, consumindo a API ASP.NET Core (.NET 10) via REST e SignalR. Sem dados mockados: toda informação vem da API.

## Stack

Next.js 15 · React 19 · TypeScript · TailwindCSS · shadcn/ui (componentes locais) · TanStack Query · Axios · Zustand · React Hook Form · Zod · Lucide · React Leaflet · SignalR Client · Chart.js · next-themes · date-fns · sonner

## Como rodar

```bash
cp .env.example .env.local   # ajuste as URLs da API
npm install
npm run dev
```

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_SIGNALR_URL=http://localhost:8080/hubs/stock
```

## Arquitetura (Feature-Based)

```
src/
  app/            Rotas finas (App Router) — só compõem features
  components/
    ui/           Primitivos shadcn-style (Button, Dialog, Select...)
    shared/       Genéricos (DataTable, ConfirmDialog, StatCard, UploadImage...)
    layout/       Shell ERP (Sidebar recolhível, Header, Notificações, UserMenu)
  features/       Cada domínio com components/hooks/schemas/types próprios
  services/       Camada ÚNICA de HTTP (axios) — componentes nunca chamam axios
  providers/      QueryProvider, ThemeProvider, AuthGuard
  store/          Zustand (auth, sidebar, notificações)
  hooks/          useDebounce, usePermissions, useSignalREvent
  types/          Contratos da API
  lib/            axios/signalr/utils
```

## Fluxo de autenticação

1. `POST /auth/login` → access token (memória/persist) + refresh token
2. Interceptor de request injeta `Authorization: Bearer`
3. Em `401`: interceptor envia o refresh token, recebe novo par e **refaz a requisição original**; requisições concorrentes compartilham a mesma promise de refresh
4. Refresh inválido → logout automático + redirect para `/login`

> Nota de segurança: os tokens são persistidos via `zustand/persist` porque a API usa Bearer token. Se o backend passar a emitir cookies HttpOnly, basta remover a persistência e o header manual — a camada de services permanece intacta.

## Permissões

O perfil (`Administrador`, `Estoquista`, `Entregador`, `Visualizador`) vem no payload do login. `usePermissions()` centraliza as checagens; a sidebar filtra itens por perfil e as ações das telas (criar/editar/excluir) só aparecem para quem pode.

## Tempo real (SignalR)

Conexão única (`lib/signalr.ts`) com reconexão automática e token via `accessTokenFactory`. O hook `useSignalREvent(evento, handler)` registra/remove handlers por componente. `RealtimeNotifications` (montado no shell) escuta `DashboardAtualizado`, `NovaMovimentacao`, `EntregaIniciada`, `EntregaFinalizada` e invalida as queries correspondentes — o dashboard e as listas se atualizam sozinhos. `PosicaoEntregador` move os marcadores do mapa em tempo real.

## Módulo de referência: Produtos

`features/products` implementa o padrão completo que os demais módulos devem seguir:

- `types/` contrato da entidade e payloads
- `schemas/` Zod + React Hook Form
- `hooks/use-products.ts` useQuery/useMutation com invalidação e toasts
- `components/products-page.tsx` DataTable genérica + pesquisa com debounce + paginação + permissões
- `components/product-form-dialog.tsx` modal de criar/editar com upload de imagem (multipart, preview e barra de progresso)
- exclusão sempre via `ConfirmDialog`

Para criar um novo módulo (ex.: Clientes): duplique a estrutura, troque o service (já existe `customersService` via `crud-factory`) e ajuste colunas/schema. As páginas stub em `app/(app)/*` indicam exatamente isso.

## UX e qualidade

- Skeletons em todas as listas e cards; EmptyState e ErrorState com retry
- Toasts (sonner) em toda mutação; botões com estado de loading
- Dark/light mode com persistência (next-themes)
- Responsivo: sidebar vira drawer no mobile
- Acessibilidade: labels ARIA, foco visível, navegação por teclado nos componentes Radix
- Mapa com `next/dynamic` (`ssr: false`) e code splitting automático por rota
