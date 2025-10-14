"use client";

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useContext(AuthContext);
  const { toast } = useToast();

  useEffect(() => {
    // Si ya hay un usuario, redirigir al dashboard.
    if (!loading && user) {
      router.push('/dashboard');
      return;
    }

    // Si no hay usuario y no se está cargando, intentar el login automático.
    if (!loading && !user) {
      const autoLogin = async () => {
        try {
          await login('emiliogp@inditex.com', '456123');
          // La redirección ocurrirá en el siguiente renderizado del useEffect
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error de autenticación automática",
            description: "Las credenciales guardadas no son correctas.",
          });
          console.error("Auto-login Error:", error);
        }
      };

      autoLogin();
    }
  }, [user, loading, login, router, toast]);

  // Mostrar siempre el loader mientras se gestiona el estado de autenticación.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Iniciando sesión...</p>
      </div>
    </div>
  );
}
