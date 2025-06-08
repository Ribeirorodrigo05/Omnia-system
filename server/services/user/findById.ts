"use server";

import {
  findUserByIdRepository,
  findUserByEmailRepository,
} from "@/server/repositories/user";

export async function getUserByIdService(id: string): Promise<any> {
  try {
    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "ID do usuário é obrigatório",
      };
    }

    const result = await findUserByIdRepository(id);

    if (!result.success) {
      return result;
    }

    const { passwordHash, ...userWithoutPassword } = result.data;

    return {
      success: true,
      data: userWithoutPassword,
    };
  } catch (error: any) {
    console.error("Error in getUserByIdService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function getUserByEmailService(email: string): Promise<any> {
  try {
    // Validar email
    if (!email || typeof email !== "string") {
      return {
        success: false,
        error: "Email é obrigatório",
      };
    }

    const result = await findUserByEmailRepository(email);

    if (!result.success) {
      return result;
    }

    // Remover dados sensíveis antes de retornar
    const { passwordHash, ...userWithoutPassword } = result.data;

    return {
      success: true,
      data: userWithoutPassword,
    };
  } catch (error: any) {
    console.error("Error in getUserByEmailService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function getUserForAuthService(email: string): Promise<any> {
  try {
    if (!email || typeof email !== "string") {
      return {
        success: false,
        error: "Email é obrigatório",
      };
    }

    return await findUserByEmailRepository(email);
  } catch (error: any) {
    console.error("Error in getUserForAuthService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
