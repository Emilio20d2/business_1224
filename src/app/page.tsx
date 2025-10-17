
"use client";

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useContext(AuthContext);
  const { toast } = useToast();
  const [authAttempted, setAuthAttempted] = useState(false);

  useEffect(() => {
    if (loading) {
      return; // Espera a que el contexto de autenticación termine de cargar
    }

    if (user) {
      router.push('/dashboard');
    } else if (!authAttempted) {
      // Solo intenta el login automático una vez si no hay usuario y no se ha intentado antes
      setAuthAttempted(true);
      const autoLogin = async () => {
        try {
          await login('emiliogp@inditex.com', '456123');
          // La redirección ocurrirá en el siguiente ciclo del useEffect cuando 'user' se actualice
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error de autenticación automática",
            description: "No se pudo iniciar sesión. Revisa las credenciales o la conexión.",
          });
          console.error("Auto-login Error:", error);
        }
      };
      autoLogin();
    }
  }, [user, loading, authAttempted, login, router, toast]);

  // Muestra la pantalla de carga mientras el estado de autenticación no sea definitivo
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Iniciando sesión...</p>
      </div>
    </div>
  );
}
