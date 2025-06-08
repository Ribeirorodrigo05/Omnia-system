import { db } from "@/server/database/connection";
import { users, type NewUser } from "@/server/database/schema/users";
import bcrypt from "bcryptjs";

export async function createUserRepository(userData: {
  name: string;
  email: string;
  password: string;
  profileMetadata?: any;
}): Promise<any> {
  try {
    // Hash da senha
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // Preparar dados para inserção
    const newUser: NewUser = {
      name: userData.name,
      email: userData.email,
      passwordHash,
      profileMetadata: userData.profileMetadata || {},
      isActive: true,
    };

    // Inserir usuário no banco
    const [createdUser] = await db.insert(users).values(newUser).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
      isActive: users.isActive,
      profileMetadata: users.profileMetadata,
    });

    return {
      success: true,
      data: createdUser,
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

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
