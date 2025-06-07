"use server";

export type User = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};
