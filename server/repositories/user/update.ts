import { db } from "@/server/database/connection";
import { users } from "@/server/database/schema/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function updateUserRepository(
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
    // Verificar se usuário existe
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      return {
        success: false,
        error: "Usuário não encontrado",
      };
    }

    // Preparar dados para update
    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (updateData.name !== undefined) {
      updateFields.name = updateData.name;
    }

    if (updateData.email !== undefined) {
      updateFields.email = updateData.email;
    }

    if (updateData.password !== undefined) {
      const saltRounds = 12;
      updateFields.passwordHash = await bcrypt.hash(
        updateData.password,
        saltRounds
      );
    }

    if (updateData.isActive !== undefined) {
      updateFields.isActive = updateData.isActive;
    }

    if (updateData.profileMetadata !== undefined) {
      updateFields.profileMetadata = updateData.profileMetadata;
    }

    // Atualizar usuário
    const [updatedUser] = await db
      .update(users)
      .set(updateFields)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        updatedAt: users.updatedAt,
        isActive: users.isActive,
        profileMetadata: users.profileMetadata,
      });

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error: any) {
    console.error("Error updating user:", error);

    // Tratamento específico para erro de email duplicado
    if (error.code === "23505" && error.constraint === "users_email_unique") {
      return {
        success: false,
        error: "Email já está em uso",
      };
    }

    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}

export async function updateLastLoginRepository(id: string): Promise<any> {
  try {
    const [updatedUser] = await db
      .update(users)
      .set({
        lastLoginAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        lastLoginAt: users.lastLoginAt,
      });

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error: any) {
    console.error("Error updating last login:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
