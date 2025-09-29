
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
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white" onClick={handleScreenClick}>
        <p className="text-xl text-red-400">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }
  
  const { ventas } = data;

  return (
    <div
      className="flex h-screen w-screen cursor-pointer flex-col items-center justify-center bg-zinc-900 p-8 text-white"
      onClick={handleScreenClick}
      style={{ fontFamily: "'Aptos', sans-serif" }}
    >
      <header className="absolute top-8 left-8">
        <Image src="/Zara_Logo.svg.png" alt="Zara Logo" width={180} height={40} />
      </header>

      <main className="flex flex-col items-center text-center">
        <h1 className="mb-4 text-6xl font-bold tracking-tight">
          VENTAS SEMANA
        </h1>
        <p className="mb-12 text-4xl text-gray-400">
          {formatWeekIdToDateRange(weekId)}
        </p>

        <div className="flex items-end gap-6">
          <p className="text-9xl font-bold">{formatCurrency(ventas.totalEuros)}</p>
          <p
            className={`text-5xl font-bold ${
              ventas.varPorcEuros >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {formatPercentage(ventas.varPorcEuros)}
          </p>
        </div>
      </main>

      <footer className="absolute bottom-8 right-8 text-right">
        <p className="text-2xl font-bold">ZARA 1224 - PUERTO VENECIA</p>
      </footer>
    </div>
  );
}

export default function PresentationPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        }>
            <PresentationPageComponent />
        </Suspense>
    );
}

