
"use client";

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading, firebaseInitialized } = useContext(AuthContext);
  const { toast } = useToast();

  useEffect(() => {
    if (!firebaseInitialized || loading) {
      return; // Espera a que Firebase y el estado de autenticación estén listos.
    }

    if (user) {
      router.push('/dashboard');
    } else {
      // Si no hay usuario, intenta el login automático una vez.
      const autoLogin = async () => {
        try {
          await login('emiliogp@inditex.com', '456123');
          // La redirección ocurrirá en el siguiente renderizado del useEffect
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error de autenticación automática",
            description: error.message || "Las credenciales guardadas no son correctas.",
          });
          console.error("Auto-login Error:", error);
        }
      };

      autoLogin();
    }
  }, [user, loading, firebaseInitialized, login, router, toast]);

  // Muestra un loader mientras se gestiona el estado de autenticación.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Iniciando sesión...</p>
      </div>
    </div>
  );
}
