"use server";

import {
  deleteUserRepository,
  softDeleteUserRepository,
} from "@/server/repositories/user";
import { updateUserRepository } from "@/server/repositories/user";

export async function deleteUserService(id: string): Promise<any> {
  try {
    // Validar ID
    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "ID do usuário é obrigatório",
      };
    }

    // Deletar usuário permanentemente
    const result = await deleteUserRepository(id);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error: any) {
    console.error("Error in deleteUserService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function deactivateUserService(id: string): Promise<any> {
  try {
    // Validar ID
    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "ID do usuário é obrigatório",
      };
    }

    // Soft delete - desativar usuário
    const result = await softDeleteUserRepository(id);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error: any) {
    console.error("Error in deactivateUserService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function reactivateUserService(id: string): Promise<any> {
  try {
    // Validar ID
    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "ID do usuário é obrigatório",
      };
    }

    // Reativar usuário
    const result = await updateUserRepository(id, { isActive: true });

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: result.data,
      message: "Usuário reativado com sucesso",
    };
  } catch (error: any) {
    console.error("Error in reactivateUserService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
