
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { WeeklyData } from '@/lib/data';
import { formatWeekIdToDateRange } from '@/lib/format';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

type PresentationData = {
  weekData: WeeklyData | null;
  footerText: string;
};

function PresentationPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const weekId = searchParams.get('week') || '';

  const [data, setData] = useState<PresentationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!weekId) {
        setError('No se ha especificado una semana.');
        setLoading(false);
        return;
      }
      try {
        const reportRef = doc(db, 'informes', weekId);
        const configRef = doc(db, "configuracion", "listas");

        const [reportSnap, configSnap] = await Promise.all([
            getDoc(reportRef),
            getDoc(configRef)
        ]);

        let weekData: WeeklyData | null = null;
        if (reportSnap.exists()) {
          weekData = reportSnap.data() as WeeklyData;
        } else {
          setError(`No se encontró ningún informe para la semana "${weekId}".`);
        }

        let footerText = "ZARA 1224 - PUERTO VENECIA"; // Default value
        if (configSnap.exists()) {
            const configData = configSnap.data() as WeeklyData['listas'];
            if(configData.presentacionFooter) {
                footerText = configData.presentacionFooter;
            }
        }
        
        setData({ weekData, footerText });

      } catch (err: any) {
        setError(`Error al cargar los datos: ${err.message}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [weekId]);

  const handleScreenClick = () => {
    router.push(`/dashboard?tab=ventas&week=${weekId}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100 text-zinc-900">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100 text-zinc-900" onClick={handleScreenClick}>
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!data?.weekData) {
    return (
       <div className="flex h-screen w-screen items-center justify-center bg-gray-100 text-zinc-900" onClick={handleScreenClick}>
        <p className="text-xl text-red-500">No hay datos del informe para mostrar.</p>
      </div>
    );
  }
  
  return (
    <div
      className="flex h-screen w-screen cursor-pointer flex-col items-center justify-center bg-white p-8 text-zinc-900"
      onClick={handleScreenClick}
      style={{ fontFamily: "'Aptos', sans-serif", fontWeight: 300 }}
    >
      <main className="flex flex-col items-center text-center gap-12">
        <Image src="/Zara_Logo.svg.png" alt="Zara Logo" width={400} height={88} />
        
        <div className="flex flex-col gap-4">
            <h1 className="text-5xl tracking-tight">
            VENTAS SEMANA
            </h1>
            <p className="text-3xl text-gray-500">
            {formatWeekIdToDateRange(weekId)}
            </p>
        </div>
      </main>

      <footer className="absolute bottom-8 text-center w-full">
        <p className="text-lg">{data.footerText}</p>
      </footer>
    </div>
  );
}

export default function PresentationPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-white">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        }>
            <PresentationPageComponent />
        </Suspense>
    );
}
