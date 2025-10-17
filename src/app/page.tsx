
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
    // Si ya no está cargando y no se ha intentado el login automático
    if (!loading && !user && !authAttempted) {
      setAuthAttempted(true); // Marcar que se va a intentar el login
      const autoLogin = async () => {
        try {
          await login('emiliogp@inditex.com', '456123');
          // Si el login es exitoso, el cambio de `user` en el siguiente ciclo
          // del useEffect se encargará de la redirección.
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
    
    // Si el usuario ya está logueado, redirigir
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, authAttempted, login, router, toast]);

  // Siempre mostrar la pantalla de carga mientras el estado no sea definitivo.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Iniciando sesión...</p>
      </div>
    </div>
  );
}
