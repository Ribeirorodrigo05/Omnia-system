"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

import { createUser } from "@/server/services/user/create";

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Função para formatar o telefone automaticamente
  const formatPhone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

    // Limita a 11 dígitos
    const limitedNumbers = numbers.slice(0, 11);

    // Aplica a formatação baseada no comprimento
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(
        2,
        7
      )}-${limitedNumbers.slice(7)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setPhone(formattedPhone);
  };
  const registerUserHandler = async () => {
    // Remove formatação do telefone antes de enviar
    const cleanPhone = phone.replace(/\D/g, "");

    const userData = {
      name,
      email,
      phone: cleanPhone,
      password,
      confirmPassword,
      termsAccepted,
    };
    const result = await createUser(userData);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="space-y-1 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Criar conta
            </CardTitle>
            <CardDescription className="text-gray-400">
              Preencha os dados abaixo para criar sua conta
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {" "}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-cy="name-input"
                />
              </div>
            </div>{" "}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-cy="email-input"
                />
              </div>
            </div>{" "}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-200">
                Telefone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />{" "}
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                  value={phone}
                  maxLength={15}
                  title="Formato: (XX) XXXXX-XXXX"
                  onChange={handlePhoneChange}
                  data-cy="phone-input"
                />
              </div>
            </div>{" "}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-cy="password-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  data-cy="toggle-password-visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>{" "}
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-gray-200">
                Confirmar senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  data-cy="confirm-password-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  data-cy="toggle-confirm-password-visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>{" "}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                className="border-gray-600 data-[state=checked]:bg-blue-600"
                onCheckedChange={(checked) => {
                  setTermsAccepted(!!checked);
                }}
                data-cy="terms-checkbox"
              />
              <Label htmlFor="terms" className="text-sm text-gray-400">
                Aceito os{" "}
                <Button
                  variant="link"
                  className="px-0 h-auto text-blue-400 hover:text-blue-300"
                  data-cy="terms-link"
                >
                  termos de uso
                </Button>{" "}
                e{" "}
                <Button
                  variant="link"
                  className="px-0 h-auto text-blue-400 hover:text-blue-300"
                  data-cy="privacy-link"
                >
                  política de privacidade
                </Button>
              </Label>
            </div>{" "}
            <Button
              onClick={() => registerUserHandler()}
              disabled={
                !termsAccepted ||
                !name ||
                !email ||
                !phone ||
                !password ||
                !confirmPassword
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              data-cy="submit-button"
            >
              Criar conta
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full bg-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">
                  Ou cadastre-se com
                </span>
              </div>
            </div>{" "}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                data-cy="google-signup-button"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                data-cy="facebook-signup-button"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>{" "}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                Já tem uma conta?{" "}
                <Button
                  variant="link"
                  className="px-0 text-blue-400 hover:text-blue-300 courser-pointer"
                  onClick={() => router.push("/sign-in")}
                  data-cy="sign-in-link"
                >
                  Entrar
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            © 2024 Sua Empresa. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
