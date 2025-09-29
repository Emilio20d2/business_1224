
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { WeeklyData } from '@/lib/data';
import { formatCurrency, formatPercentage, formatWeekIdToDateRange } from '@/lib/format';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

function PresentationPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const weekId = searchParams.get('week') || '';

  const [data, setData] = useState<WeeklyData | null>(null);
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
        const reportSnap = await getDoc(reportRef);
        if (reportSnap.exists()) {
          setData(reportSnap.data() as WeeklyData);
        } else {
          setError(`No se encontró ningún informe para la semana "${weekId}".`);
        }
      } catch (err: any) {
        setError(`Error al cargar el informe: ${err.message}.`);
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

  if (!data) {
    return null;
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
        <p className="text-lg">ZARA 1224 - PUERTO VENECIA</p>
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

