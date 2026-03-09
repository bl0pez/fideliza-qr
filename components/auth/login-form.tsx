"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

import { signInWithEmail } from "@/app/actions/auth";
import { useState } from "react";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Correo inválido")
    .required("El correo es requerido"),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

interface LoginFormProps {
  nextUrl?: string;
}

export function LoginForm({ nextUrl = "/dashboard" }: LoginFormProps) {
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setMessage(null);
    try {
      const result = await signInWithEmail(data.email, nextUrl);
      setMessage({
        type: "success",
        text: result.message,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al enviar el correo.";
      setMessage({ type: "error", text: errorMessage });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'}`}>
          {message.text}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="nombre@ejemplo.com"
          className={`col-span-3 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-xs text-destructive font-medium">
            {errors.email.message}
          </p>
        )}
      </div>
      <Button
        className="w-full py-6 font-semibold"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : null}
        {isSubmitting ? "Enviando enlace..." : "Iniciar sesión por correo"}
      </Button>
    </form>
  );
}
