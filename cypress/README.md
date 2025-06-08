# Testes End-to-End com Cypress

Este projeto utiliza o Cypress para testes end-to-end da aplicação.

## Instalação

O Cypress já está instalado como dependência de desenvolvimento. Se precisar reinstalar:

```bash
pnpm add -D cypress
```

## Comandos Disponíveis

### Executar testes em modo interativo

```bash
pnpm cypress:open
# ou
pnpm test:e2e:open
```

### Executar testes em modo headless

```bash
pnpm cypress:run
# ou
pnpm test:e2e
```

### Executar testes específicos

```bash
pnpm cypress:run --spec "cypress/e2e/sign-up.cy.ts"
```

## Estrutura dos Testes

### Pasta cypress/e2e/

- `sign-up.cy.ts` - Testes principais da página de cadastro
- `sign-up-custom.cy.ts` - Testes usando comandos customizados

### Pasta cypress/support/

- `commands.ts` - Comandos customizados do Cypress
- `e2e.ts` - Configurações globais dos testes

## Convenções de Teste

### Atributos data-cy

Todos os elementos testáveis possuem atributos `data-cy` para seleção consistente:

- `data-cy="name-input"` - Campo de nome
- `data-cy="email-input"` - Campo de email
- `data-cy="phone-input"` - Campo de telefone (com formatação automática)
- `data-cy="password-input"` - Campo de senha
- `data-cy="confirm-password-input"` - Campo de confirmação de senha
- `data-cy="terms-checkbox"` - Checkbox de termos
- `data-cy="submit-button"` - Botão de envio
- `data-cy="toggle-password-visibility"` - Botão para mostrar/ocultar senha
- `data-cy="toggle-confirm-password-visibility"` - Botão para mostrar/ocultar confirmação de senha

### Comandos Customizados

#### fillSignUpForm(userData)

Preenche todo o formulário de cadastro com os dados fornecidos.

```typescript
cy.fillSignUpForm({
  name: "João Silva",
  email: "joao@email.com",
  phone: "(11) 99999-9999",
  password: "senha123",
  confirmPassword: "senha123",
  acceptTerms: true, // opcional, padrão é true
});
```

#### checkFormValidation(shouldBeValid)

Verifica se o formulário está em estado válido ou inválido.

```typescript
cy.checkFormValidation(true); // Espera que o botão esteja habilitado
cy.checkFormValidation(false); // Espera que o botão esteja desabilitado
```

## Cenários de Teste Cobertos

### Página de Sign-Up (/sign-up)

1. **Renderização de elementos**

   - Verificação de presença de todos os campos
   - Verificação de labels e placeholders
   - Estado inicial do botão de envio

2. **Validação de formulário**

   - Habilitação do botão apenas com todos os campos preenchidos
   - Verificação de aceitação de termos obrigatória
   - Validação de tipos de input (email, telefone)

3. **Funcionalidades interativas**

   - Toggle de visibilidade de senhas
   - Formatação automática do telefone (xx) xxxxx-xxxx
   - Preenchimento e manutenção de estado dos campos
   - Navegação para página de login

4. **Acessibilidade**

   - Verificação de atributos de acessibilidade
   - Associação correta de labels com inputs

5. **Fluxo completo**

   - Preenchimento completo do formulário
   - Envio de dados (simulado)
   - Verificação de limpeza de formatação antes do envio

6. **Validação de dados**
   - Formatação automática do telefone durante digitação
   - Envio de telefone sem formatação para o backend
   - Validação de senhas e confirmação

## Funcionalidades Especiais

### Formatação Automática de Telefone

O campo de telefone possui formatação automática que:

- Converte entrada para formato (xx) xxxxx-xxxx
- Remove caracteres não numéricos automaticamente
- Limita a 11 dígitos (padrão brasileiro)
- Envia apenas números para o backend

**Exemplo de uso nos testes:**

```typescript
// Digitar apenas números
cy.get('[data-cy="phone-input"]').type("11999991234");
// Campo mostrará: (11) 99999-1234
// Backend receberá: 11999991234
```

## Boas Práticas Implementadas

1. **Seletores consistentes**: Uso de `data-cy` em vez de classes CSS
2. **Comandos reutilizáveis**: Funções customizadas para ações comuns
3. **Testes isolados**: Cada teste é independente e reseta o estado
4. **Cobertura abrangente**: Testes de UI, validação, interação e fluxo completo
5. **Interceptação de APIs**: Preparado para mock de chamadas HTTP

## Configuração do Ambiente

O Cypress está configurado para:

- Base URL: `http://localhost:3000`
- Testes E2E habilitados
- Suporte a TypeScript

Para executar os testes, certifique-se de que a aplicação está rodando em `localhost:3000`:

```bash
pnpm dev
```

Em seguida, execute os testes em outro terminal:

```bash
pnpm test:e2e:open
```
