"use server";

import { User } from "@/server/types/user";
import { validateCreateUser } from "@/server/validations/createUserValidation";
import { createUserRepository } from "@/server/repositories/user";

export async function createUserService(userData: User): Promise<any> {
  try {
    // Validação dos dados
    const { success, errors } = await validateCreateUser(userData);

    if (!success) {
      return {
        success: false,
        errors,
      };
    }

    // Preparar dados para o repository
    const repositoryData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      profileMetadata: {
        phone: userData.phone,
        termsAccepted: userData.termsAccepted,
        termsAcceptedAt: new Date().toISOString(),
      },
    };

    // Criar usuário via repository
    const result = await createUserRepository(repositoryData);

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    // Retornar dados do usuário criado (sem dados sensíveis)
    return {
      success: true,
      data: {
        id: result.data.id,
        name: result.data.name,
        email: result.data.email,
        createdAt: result.data.createdAt,
        isActive: result.data.isActive,
      },
      message: "Usuário criado com sucesso",
    };
  } catch (error: any) {
    console.error("Error in createUserService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
