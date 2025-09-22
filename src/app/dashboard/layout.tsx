"use client";

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getInitialDataForWeek, type WeeklyData } from '@/lib/data';

export default function DashboardLayout({
  children,
}: {
  children: (data: WeeklyData) => React.ReactNode;
}) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [data, setData] = useState<WeeklyData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/');
      } else {
        const fetchData = async () => {
          console.log("Dashboard Layout: User authenticated, fetching data...");
          setDataLoading(true);
          setError(null);
          try {
            const week = "semana-24";
            const docRef = doc(db, "informes", week);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              console.log("Dashboard Layout: Data found in Firestore.");
              setData(docSnap.data() as WeeklyData);
            } else {
              console.log("Dashboard Layout: No data in Firestore, using initial data.");
              const initialData = getInitialDataForWeek(week);
              await setDoc(docRef, initialData); // Save initial data to Firestore
              setData(initialData);
            }
          } catch (err: any) {
            console.error("Dashboard Layout: Error fetching Firestore document:", err);
            if (err.code === 'unavailable' || err.message.includes('offline')) {
              setError("No se pudo conectar a la base de datos. Por favor, verifica tu conexión.");
            } else if (err.code === 'permission-denied') {
              setError("Error de permisos. Revisa las reglas de seguridad de Firestore.");
            } else {
              setError("Ocurrió un error inesperado al cargar los datos.");
            }
          } finally {
            setDataLoading(false);
          }
        };

        fetchData();
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4">
          {authLoading ? "Verificando sesión..." : "Cargando datos del informe..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center p-4">
        <p className="text-lg font-semibold text-destructive">Error al Cargar Datos</p>
        <p className="text-muted-foreground">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">Reintentar</button>
      </div>
    );
  }

  if (data) {
    // We are cloning the element and passing the data as a prop.
    // This expects `children` to be a single React element.
    return React.cloneElement(children as React.ReactElement, { initialData: data });
  }

  return null; // or some fallback UI
}