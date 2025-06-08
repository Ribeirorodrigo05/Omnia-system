"use server";

import {
  updateUserRepository,
  updateLastLoginRepository,
} from "@/server/repositories/user";
import { z } from "zod";

// Schema de validação para update
const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(255, "Nome não pode ter mais de 255 caracteres")
    .optional(),
  email: z
    .string()
    .email("Email inválido")
    .max(320, "Email não pode ter mais de 320 caracteres")
    .optional(),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número"
    )
    .optional(),
  isActive: z.boolean().optional(),
  profileMetadata: z.any().optional(),
});

export async function updateUserService(
  id: string,
  updateData: {
    name?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
    profileMetadata?: any;
  }
): Promise<any> {
  try {
    // Validar ID
    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "ID do usuário é obrigatório",
      };
    }

    // Validar dados de update
    const validation = updateUserSchema.safeParse(updateData);
    if (!validation.success) {
      const errors: any = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        errors[field] = errors[field] || [];
        errors[field].push(err.message);
      });

      return {
        success: false,
        errors,
      };
    }

    // Verificar se há dados para atualizar
    const hasDataToUpdate = Object.keys(updateData).length > 0;
    if (!hasDataToUpdate) {
      return {
        success: false,
        error: "Nenhum dado fornecido para atualização",
      };
    }

    // Atualizar usuário
    const result = await updateUserRepository(id, updateData);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: result.data,
      message: "Usuário atualizado com sucesso",
    };
  } catch (error: any) {
    console.error("Error in updateUserService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function updateUserProfileService(
  id: string,
  profileData: {
    name?: string;
    phone?: string;
    profileMetadata?: any;
  }
): Promise<any> {
  try {
    // Validar ID
    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "ID do usuário é obrigatório",
      };
    }

    // Preparar dados de perfil
    const updateData: any = {};

    if (profileData.name) {
      updateData.name = profileData.name;
    }

    if (profileData.phone || profileData.profileMetadata) {
      updateData.profileMetadata = {
        ...profileData.profileMetadata,
        phone: profileData.phone,
        updatedAt: new Date().toISOString(),
      };
    }

    return await updateUserService(id, updateData);
  } catch (error: any) {
    console.error("Error in updateUserProfileService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function updateLastLoginService(id: string): Promise<any> {
  try {
    if (!id || typeof id !== "string") {
      return {
        success: false,
        error: "ID do usuário é obrigatório",
      };
    }

    return await updateLastLoginRepository(id);
  } catch (error: any) {
    console.error("Error in updateLastLoginService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
