"use server";

import { User } from "@/server/types/user";
import { validateCreateUser } from "@/server/validations/createUserValidation";

export async function createUser(userData: User): Promise<any> {
  const { success, errors } = await validateCreateUser(userData);

  if (!success) {
    console.error("User creation validation failed:", errors);
    return errors;
  }
}
