# Banco de Dados - Omnia System

## 🗄️ Estrutura do Banco

O sistema utiliza **PostgreSQL** via **Neon** (serverless) com **Drizzle ORM**.

### 📋 Tabelas

1. **users** - Usuários do sistema
2. **workspaces** - Espaços de trabalho (empresas/organizações)
3. **workspace_members** - Membros dos workspaces
4. **spaces** - Espaços dentro dos workspaces (projetos/equipes)
5. **space_members** - Membros dos spaces
6. **categories** - Categorias/listas dentro dos spaces

### 🔗 Relacionamentos

- Users podem ter múltiplos workspaces
- Users podem ser membros de múltiplos workspaces e spaces
- Workspaces contêm múltiplos spaces
- Spaces contêm múltiplas categories
- Sistema de permissões via JSONB para flexibilidade

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
```

### 2. Comandos Disponíveis

```bash
# Gerar migrações
pnpm db:generate

# Aplicar migrações
pnpm db:migrate

# Push schema diretamente (desenvolvimento)
pnpm db:push

# Abrir Drizzle Studio
pnpm db:studio

# Executar seed
pnpm db:seed
```

## 🚀 Primeiros Passos

### 1. Configurar Banco no Neon

1. Acesse [Neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie a connection string
4. Adicione no arquivo `.env`

### 2. Aplicar Schema

```bash
# Push do schema para o banco
pnpm db:push

# Ou gerar e aplicar migrações
pnpm db:generate
pnpm db:migrate
```

### 3. Popular Dados Iniciais

```bash
pnpm db:seed
```

### 4. Verificar com Drizzle Studio

```bash
pnpm db:studio
```

## 📊 Dados de Exemplo (Seed)

O seed cria:

- 2 usuários (Admin e Demo)
- 1 workspace
- 2 spaces (Projetos Ativos, Backlog)
- 5 categories (To Do, In Progress, Done, Sprint 1, Ideias)
- Relacionamentos entre usuários e espaços

## 🔧 Tipos TypeScript

Todos os schemas geram tipos automáticos:

```typescript
import {
  User,
  NewUser,
  Workspace,
  Space,
  Category,
} from "@/server/database/schema";

// Tipos para inserção
const newUser: NewUser = {
  name: "João",
  email: "joao@email.com",
  passwordHash: "...",
};

// Tipos para seleção
const user: User = await db.select().from(users).where(eq(users.id, userId));
```

## 🛡️ Segurança

- Senhas hasheadas com bcrypt
- UUIDs para IDs
- Validação via Zod integrada
- Soft deletes com `isActive`
- Sistema de permissões flexível via JSONB

## 📈 Performance

- Indexes automáticos em PKs e FKs
- Connection pooling via Neon
- Lazy loading de relacionamentos
- Campos JSONB para metadados flexíveis
