"use client";

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AuthContext } from '@/context/auth-context';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = React.useState('emiliogp@inditex.com');
  const [password, setPassword] = React.useState('456123');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const router = useRouter();
  const { login, user, loading } = useContext(AuthContext);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: "El correo electrónico o la contraseña no son correctos.",
      });
      console.error("Authentication Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || (!loading && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">BUSSINES MAN</CardTitle>
          <CardDescription>
            Introduce tus credenciales para acceder al panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
