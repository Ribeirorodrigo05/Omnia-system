"use server";

import { z } from "zod";
import { User } from "../types/user";

const createUserSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(50, "Nome deve ter no máximo 50 caracteres")
      .regex(/^[A-Za-zÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

    email: z
      .string()
      .email("Formato de email inválido")
      .max(100, "Email deve ter no máximo 100 caracteres")
      .toLowerCase(),

    phone: z
      .string()
      .optional()
      .refine((phone) => {
        if (!phone) return true;
        const phoneRegex = /^(?:\(\d{2}\)\s?)?(?:\d{4,5}[-\s]?\d{4})$/;
        return phoneRegex.test(phone);
      }, "Formato de telefone inválido"),

    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(100, "Senha deve ter no máximo 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial"
      ),

    confirmPassword: z.string(),

    termsAccepted: z
      .boolean()
      .refine((val) => val === true, "Você deve aceitar os termos de uso"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type ValidationErrors = {
  [K in keyof User]?: string;
};

export type ValidationResult = {
  success: boolean;
  data?: User;
  errors?: ValidationErrors;
};

export async function validateCreateUser(
  userData: unknown
): Promise<ValidationResult> {
  try {
    const validatedData = createUserSchema.parse(userData);

    return {
      success: true,
      data: validatedData as User,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: ValidationErrors = {};

      error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof User;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = err.message;
        }
      });

      return {
        success: false,
        errors: fieldErrors,
      };
    }

    return {
      success: false,
      errors: {
        name: "Erro interno do servidor",
      },
    };
  }
}

export async function validateUserField(
  fieldName: keyof User,
  value: unknown
): Promise<{ valid: boolean; error?: string }> {
  try {
    const fieldSchema = (createUserSchema.innerType() as z.ZodObject<any>)
      .shape[fieldName];
    fieldSchema.parse(value);

    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        error: error.errors[0]?.message || "Valor inválido",
      };
    }

    return {
      valid: false,
      error: "Erro de validação",
    };
  }
}
