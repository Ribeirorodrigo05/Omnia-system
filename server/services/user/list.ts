"use server";

import {
  listUsersRepository,
  getUserStatsRepository,
} from "@/server/repositories/user";
import { z } from "zod";

// Schema de validação para parâmetros de listagem
const listUsersSchema = z.object({
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  onlyActive: z.boolean().optional().default(true),
  sortBy: z
    .enum(["name", "email", "createdAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export async function listUsersService(params: {
  page?: number;
  limit?: number;
  search?: string;
  onlyActive?: boolean;
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}): Promise<any> {
  try {
    // Validar parâmetros
    const validation = listUsersSchema.safeParse(params);
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

    const validatedParams = validation.data;

    // Buscar usuários
    const result = await listUsersRepository(validatedParams);

    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error: any) {
    console.error("Error in listUsersService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function searchUsersService(searchTerm: string): Promise<any> {
  try {
    // Validar termo de busca
    if (
      !searchTerm ||
      typeof searchTerm !== "string" ||
      searchTerm.trim().length < 2
    ) {
      return {
        success: false,
        error: "Termo de busca deve ter pelo menos 2 caracteres",
      };
    }

    // Buscar usuários com termo específico
    return await listUsersService({
      search: searchTerm.trim(),
      limit: 20,
      onlyActive: true,
    });
  } catch (error: any) {
    console.error("Error in searchUsersService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function getUserStatsService(): Promise<any> {
  try {
    const result = await getUserStatsRepository();

    if (!result.success) {
      return result;
    }

    // Adicionar estatísticas calculadas
    const { totalUsers, activeUsers, inactiveUsers, recentUsers } = result.data;

    const stats = {
      ...result.data,
      activePercentage:
        totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
      inactivePercentage:
        totalUsers > 0 ? Math.round((inactiveUsers / totalUsers) * 100) : 0,
      recentPercentage:
        totalUsers > 0 ? Math.round((recentUsers / totalUsers) * 100) : 0,
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error: any) {
    console.error("Error in getUserStatsService:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
