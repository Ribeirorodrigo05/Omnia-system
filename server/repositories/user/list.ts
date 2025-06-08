import { db } from "@/server/database/connection";
import { users } from "@/server/database/schema/users";
import { eq, like, desc, asc, count, gte, and, or } from "drizzle-orm";

export async function listUsersRepository(options: {
  page?: number;
  limit?: number;
  search?: string;
  onlyActive?: boolean;
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}): Promise<any> {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      onlyActive = true,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    // Construir condições de filtro
    const conditions: any[] = [];

    if (onlyActive) {
      conditions.push(eq(users.isActive, true));
    }

    if (search) {
      conditions.push(like(users.name, `%${search}%`));
    }

    // Construir where clause
    const whereClause =
      conditions.length > 0
        ? conditions.length === 1
          ? conditions[0]
          : and(...conditions)
        : undefined;

    // Query principal - construir diretamente
    const baseQuery = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLoginAt: users.lastLoginAt,
        isActive: users.isActive,
        profileMetadata: users.profileMetadata,
      })
      .from(users);

    // Aplicar filtros se existirem
    const filteredQuery = whereClause
      ? baseQuery.where(whereClause)
      : baseQuery;

    // Aplicar ordenação
    let orderedQuery;
    if (sortBy === "name") {
      orderedQuery =
        sortOrder === "asc"
          ? filteredQuery.orderBy(asc(users.name))
          : filteredQuery.orderBy(desc(users.name));
    } else if (sortBy === "email") {
      orderedQuery =
        sortOrder === "asc"
          ? filteredQuery.orderBy(asc(users.email))
          : filteredQuery.orderBy(desc(users.email));
    } else {
      orderedQuery =
        sortOrder === "asc"
          ? filteredQuery.orderBy(asc(users.createdAt))
          : filteredQuery.orderBy(desc(users.createdAt));
    }

    // Aplicar paginação
    const offset = (page - 1) * limit;
    const finalQuery = orderedQuery.limit(limit).offset(offset);

    // Executar query principal
    const usersList = await finalQuery;

    // Contar total de registros
    const countBaseQuery = db.select({ count: count() }).from(users);
    const countQuery = whereClause
      ? countBaseQuery.where(whereClause)
      : countBaseQuery;
    const [{ count: totalUsers }] = await countQuery;

    // Calcular metadados de paginação
    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      success: true,
      data: {
        users: usersList,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          limit,
          hasNextPage,
          hasPreviousPage,
        },
      },
    };
  } catch (error: any) {
    console.error("Error listing users:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function getUserStatsRepository(): Promise<any> {
  try {
    // Total de usuários
    const [{ totalUsers }] = await db
      .select({ totalUsers: count() })
      .from(users);

    // Usuários ativos
    const [{ activeUsers }] = await db
      .select({ activeUsers: count() })
      .from(users)
      .where(eq(users.isActive, true));

    // Usuários inativos
    const inactiveUsers = totalUsers - activeUsers; // Usuários criados nos últimos 30 dias
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [{ recentUsers }] = await db
      .select({ recentUsers: count() })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));

    return {
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        recentUsers,
      },
    };
  } catch (error: any) {
    console.error("Error getting user stats:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
