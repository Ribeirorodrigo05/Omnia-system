#!/usr/bin/env tsx

/**
 * Script de teste para o CRUD de usuários
 * Execute com: pnpm tsx server/test-crud.ts
 */

import {
  createUserService,
  getUserByIdService,
  getUserByEmailService,
  updateUserService,
  listUsersService,
  getUserStatsService,
  deactivateUserService,
} from "./services/user";

async function testUserCRUD() {
  console.log("🚀 Iniciando testes do CRUD de usuários...\n");

  try {
    // 1. Teste de criação de usuário
    console.log("1️⃣  Testando criação de usuário...");
    const createResult = await createUserService({
      name: "João Silva",
      email: "joao.teste@example.com",
      phone: "11999887766",
      password: "MinhaSenh@123",
      confirmPassword: "MinhaSenh@123",
      termsAccepted: true,
    });

    if (createResult.success) {
      console.log("✅ Usuário criado com sucesso:", createResult.data);
      const userId = createResult.data.id;

      // 2. Teste de busca por ID
      console.log("\n2️⃣  Testando busca por ID...");
      const findResult = await getUserByIdService(userId);
      if (findResult.success) {
        console.log("✅ Usuário encontrado:", findResult.data);
      } else {
        console.log("❌ Erro ao buscar usuário:", findResult.error);
      }

      // 3. Teste de busca por email
      console.log("\n3️⃣  Testando busca por email...");
      const findByEmailResult = await getUserByEmailService(
        "joao.teste@example.com"
      );
      if (findByEmailResult.success) {
        console.log(
          "✅ Usuário encontrado por email:",
          findByEmailResult.data.name
        );
      } else {
        console.log(
          "❌ Erro ao buscar usuário por email:",
          findByEmailResult.error
        );
      }

      // 4. Teste de atualização
      console.log("\n4️⃣  Testando atualização de usuário...");
      const updateResult = await updateUserService(userId, {
        name: "João Santos Silva",
        profileMetadata: {
          bio: "Desenvolvedor Full Stack",
          location: "São Paulo, SP",
        },
      });
      if (updateResult.success) {
        console.log("✅ Usuário atualizado:", updateResult.data);
      } else {
        console.log("❌ Erro ao atualizar usuário:", updateResult.error);
      }

      // 5. Teste de listagem
      console.log("\n5️⃣  Testando listagem de usuários...");
      const listResult = await listUsersService({
        page: 1,
        limit: 5,
        onlyActive: true,
      });
      if (listResult.success) {
        console.log("✅ Usuários listados:", {
          total: listResult.data.pagination.totalUsers,
          users: listResult.data.users.length,
        });
      } else {
        console.log("❌ Erro ao listar usuários:", listResult.error);
      }

      // 6. Teste de estatísticas
      console.log("\n6️⃣  Testando estatísticas...");
      const statsResult = await getUserStatsService();
      if (statsResult.success) {
        console.log("✅ Estatísticas:", statsResult.data);
      } else {
        console.log("❌ Erro ao obter estatísticas:", statsResult.error);
      }

      // 7. Teste de desativação (soft delete)
      console.log("\n7️⃣  Testando desativação de usuário...");
      const deactivateResult = await deactivateUserService(userId);
      if (deactivateResult.success) {
        console.log("✅ Usuário desativado:", deactivateResult.message);
      } else {
        console.log("❌ Erro ao desativar usuário:", deactivateResult.error);
      }
    } else {
      console.log(
        "❌ Erro ao criar usuário:",
        createResult.error || createResult.errors
      );
    }
  } catch (error) {
    console.error("❌ Erro geral no teste:", error);
  }

  console.log("\n🏁 Testes finalizados!");
}

// Teste de validação (dados inválidos)
async function testValidation() {
  console.log("\n🔍 Testando validações...");

  const invalidUser = await createUserService({
    name: "A", // Nome muito curto
    email: "email-invalido", // Email inválido
    phone: "123", // Telefone inválido
    password: "123", // Senha muito fraca
    confirmPassword: "456", // Senhas não coincidem
    termsAccepted: false, // Termos não aceitos
  });

  if (!invalidUser.success) {
    console.log("✅ Validações funcionando:", invalidUser.errors);
  } else {
    console.log("❌ Validações falharam");
  }
}

// Executar testes
async function runTests() {
  await testUserCRUD();
  await testValidation();
}

if (require.main === module) {
  runTests().catch(console.error);
}
