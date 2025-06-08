import { db } from "@/server/database/connection";
import { users } from "@/server/database/schema/users";
import { eq } from "drizzle-orm";

export async function findUserByIdRepository(id: string): Promise<any> {
  try {
    const [user] = await db
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
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    console.error("Error finding user by ID:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function findUserByEmailRepository(email: string): Promise<any> {
  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        passwordHash: users.passwordHash,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        lastLoginAt: users.lastLoginAt,
        isActive: users.isActive,
        profileMetadata: users.profileMetadata,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error: any) {
    console.error("Error finding user by email:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
