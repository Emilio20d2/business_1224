import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';


type VentasManTabProps = {
  // This component no longer holds complex logic, it's just a placeholder.
};

export function VentasManTab({ }: VentasManTabProps) {
    const router = useRouter();

  return (
    <Card>
        <CardHeader>
            <CardTitle>Gestión de Ventas Man</CardTitle>
            <CardDescription>
                La gestión de Ventas Man se ha movido a una página dedicada para mejorar el rendimiento y la usabilidad.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center gap-4 pt-6">
            <p>Haz clic en el botón para acceder a la sección de Ventas Man.</p>
            <Button onClick={() => router.push('/dashboard/ventas-man')}>
                Ir a Ventas Man
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </CardContent>
    </Card>
  );
}

    