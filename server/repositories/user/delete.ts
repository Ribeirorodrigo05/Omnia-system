import { db } from "@/server/database/connection";
import { users } from "@/server/database/schema/users";
import { eq } from "drizzle-orm";

export async function deleteUserRepository(id: string): Promise<any> {
  try {
    // Verificar se usuário existe
    const [existingUser] = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    // Deletar usuário (hard delete)
    await db.delete(users).where(eq(users.id, id));

    return {
      success: true,
      message: `Usuário ${existingUser.name} foi removido permanentemente`,
    };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function softDeleteUserRepository(id: string): Promise<any> {
  try {
    // Verificar se usuário existe
    const [existingUser] = await db
      .select({ id: users.id, name: users.name, isActive: users.isActive })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    if (!existingUser.isActive) {
      return {
        success: false,
        error: "Usuário já está inativo",
      };
    }

    // Soft delete - marcar como inativo
    const [updatedUser] = await db
      .update(users)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        isActive: users.isActive,
      });

    return {
      success: true,
      data: updatedUser,
      message: `Usuário ${updatedUser.name} foi desativado`,
    };
  } catch (error: any) {
    console.error("Error soft deleting user:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
