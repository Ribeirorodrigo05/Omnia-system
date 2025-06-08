# CRUD de Usuários - Documentação

Este documento explica como usar o sistema CRUD completo implementado para a entidade User.

## Arquitetura

O sistema segue uma arquitetura em camadas:

```
Components/Pages (UI Layer)
    ↓
Services (server/services/user) - Business Logic
    ↓
Repositories (server/repositories/user) - Data Access
    ↓
Database (Neon PostgreSQL + Drizzle ORM)
```

## Funcionalidades Implementadas

### 1. Create (Criar Usuário)

- **Service**: `createUserService`
- **Repository**: `createUserRepository`
- **Validação**: Zod schema completo
- **Segurança**: Hash bcrypt para senhas

### 2. Read (Buscar Usuários)

- **Service**: `getUserByIdService`, `getUserByEmailService`, `listUsersService`
- **Repository**: `findUserByIdRepository`, `findUserByEmailRepository`, `listUsersRepository`
- **Recursos**: Paginação, busca, filtros, ordenação

### 3. Update (Atualizar Usuário)

- **Service**: `updateUserService`, `updateUserProfileService`
- **Repository**: `updateUserRepository`, `updateLastLoginRepository`
- **Segurança**: Hash de nova senha, validação de dados

### 4. Delete (Deletar Usuário)

- **Service**: `deleteUserService`, `deactivateUserService`
- **Repository**: `deleteUserRepository`, `softDeleteUserRepository`
- **Opções**: Hard delete ou soft delete (desativação)

### 5. Estatísticas

- **Service**: `getUserStatsService`
- **Repository**: `getUserStatsRepository`

## Como Usar

### 1. Configurar Banco de Dados

```bash
# 1. Configurar variáveis de ambiente
cp .env.example .env
# Adicionar DATABASE_URL do Neon

# 2. Gerar migrações
pnpm db:generate

# 3. Aplicar migrações
pnpm db:push

# 4. Popular dados iniciais (opcional)
pnpm db:seed
```

### 2. Criar Usuário

**Via Service (Server-side):**

```javascript
import { createUserService } from "@/server/services/user";

const result = await createUserService({
  name: "João Silva",
  email: "joao@example.com",
  phone: "11999887766",
  password: "MinhaSenh@123",
  confirmPassword: "MinhaSenh@123",
  termsAccepted: true,
});

if (result.success) {
  console.log("Usuário criado:", result.data);
} else {
  console.log("Erro:", result.error || result.errors);
}
```

### 3. Buscar Usuários

**Buscar por ID:**

```javascript
import { getUserByIdService } from "@/server/services/user";

const result = await getUserByIdService("123e4567-e89b-12d3-a456-426614174000");
if (result.success) {
  console.log("Usuário:", result.data);
}
```

**Buscar por Email:**

```javascript
import { getUserByEmailService } from "@/server/services/user";

const result = await getUserByEmailService("joao@example.com");
if (result.success) {
  console.log("Usuário:", result.data);
}
```

**Listar com paginação:**

```javascript
import { listUsersService } from "@/server/services/user";

const result = await listUsersService({
  page: 1,
  limit: 10,
  search: "joão",
  onlyActive: true,
  sortBy: "createdAt",
  sortOrder: "desc",
});
```

**Obter estatísticas:**

```javascript
import { getUserStatsService } from "@/server/services/user";

const result = await getUserStatsService();
if (result.success) {
  console.log("Stats:", result.data);
}
```

### 4. Atualizar Usuário

```javascript
import { updateUserService } from "@/server/services/user";

const result = await updateUserService("123e4567-e89b-12d3-a456-426614174000", {
  name: "João Santos",
  email: "joao.santos@example.com",
  profileMetadata: {
    bio: "Desenvolvedor Full Stack",
  },
});
```

### 5. Deletar/Desativar Usuário

**Soft Delete (desativar):**

```javascript
import { deactivateUserService } from "@/server/services/user";

const result = await deactivateUserService(
  "123e4567-e89b-12d3-a456-426614174000"
);
```

**Hard Delete (remover permanentemente):**

```javascript
import { deleteUserService } from "@/server/services/user";

const result = await deleteUserService("123e4567-e89b-12d3-a456-426614174000");
```

## Validações

### Campos Obrigatórios

- **name**: 2-255 caracteres
- **email**: Email válido, único no sistema
- **password**: Mínimo 8 caracteres, com maiúscula, minúscula e número
- **termsAccepted**: Deve ser true

### Campos Opcionais

- **phone**: Telefone brasileiro (10-11 dígitos)
- **profileMetadata**: Dados JSON adicionais

## Tratamento de Erros

### Tipos de Resposta

```javascript
// Sucesso
{
  success: true,
  data: { ... },
  message: "Operação realizada com sucesso"
}

// Erro de validação
{
  success: false,
  errors: {
    email: ["Email já está em uso"],
    password: ["Senha deve ter pelo menos 8 caracteres"]
  }
}

// Erro geral
{
  success: false,
  error: "Usuário não encontrado"
}
```

## Segurança

1. **Senhas**: Hash bcrypt com salt rounds 12
2. **Dados Sensíveis**: passwordHash nunca retornado nas APIs
3. **Validação**: Validação rigorosa em todos os níveis
4. **SQL Injection**: Proteção via Drizzle ORM
5. **Unique Constraints**: Email único no banco

## Performance

1. **Índices**: Email indexado automaticamente (unique)
2. **Paginação**: Limite máximo de 100 registros por página
3. **Soft Delete**: Usuários inativos mantidos para auditoria
4. **Lazy Loading**: Campos sensíveis só carregados quando necessário

## Próximos Passos

1. Implementar autenticação (JWT/Sessions)
2. Adicionar middleware de autorização
3. Implementar auditoria de mudanças
4. Adicionar testes unitários e de integração
5. Implementar rate limiting
6. Adicionar logs estruturados
