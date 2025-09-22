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
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [data, setData] = useState<WeeklyData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait until the authentication status is resolved
    if (authLoading) {
      return;
    }

    // If authentication is resolved and there is no user, redirect to login
    if (!user) {
      router.push('/');
      return;
    }

    // If there is a user, proceed to fetch data
    const fetchData = async () => {
      console.log(`User authenticated with UID: ${user.uid}. Fetching Firestore data...`);
      setDataLoading(true);
      setError(null);
      try {
        const week = "semana-24";
        const docRef = doc(db, "informes", week);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Data found in Firestore.");
          setData(docSnap.data() as WeeklyData);
        } else {
          console.log("No data in Firestore for this week, creating with initial data.");
          const initialData = getInitialDataForWeek(week);
          await setDoc(docRef, initialData); // Save initial data to Firestore
          setData(initialData);
          console.log("Initial data set in Firestore.");
        }
      } catch (err: any) {
        console.error("Error fetching or setting Firestore document:", err);
        setError(`Error: ${err.message} (Code: ${err.code})`);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();

  }, [user, authLoading, router]);

  if (authLoading || (dataLoading && !error)) {
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
        <p className="text-sm mt-2 text-muted-foreground">Asegúrate de que la base de datos Firestore está creada en tu proyecto y que las reglas de seguridad son correctas.</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">Reintentar</button>
      </div>
    );
  }

  if (data) {
    // Clone the children (DashboardPage) and pass the loaded data as a prop
    return React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { initialData: data } as { initialData: WeeklyData });
        }
        return child;
    });
  }

  // Fallback for edge cases where data is null but there is no error
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>No se pudieron cargar los datos.</p>
    </div>
  );
}
