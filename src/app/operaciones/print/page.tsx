
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { WeeklyData, Empleado, PlanificacionItem } from '@/lib/data';
import { formatWeekIdToDateRange } from '@/lib/format';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const PrintSection = ({
    title,
    planificacion
}: {
    title: string;
    planificacion: PlanificacionItem[];
}) => {
    const confeccionItems = planificacion.filter(p => p.tarea === 'confeccion');
    const paqueteriaItems = planificacion.filter(p => p.tarea === 'paqueteria');

    const renderColumn = (items: PlanificacionItem[], columnTitle: string) => (
        <div className="flex flex-col gap-2">
            <h3 className="font-bold text-center text-muted-foreground uppercase text-sm">{columnTitle}</h3>
            <div className="flex flex-col gap-1 text-sm border p-2 rounded-lg min-h-[100px]">
                {items.length > 0 ? items.map(item => (
                    <div key={item.id} className="grid grid-cols-[1fr_1fr] gap-2 items-center">
                        <p className="font-medium p-1 bg-gray-50 rounded text-xs">{item.nombreEmpleado || '--'}</p>
                        <p className="text-xs text-muted-foreground p-1">{item.anotaciones || '--'}</p>
                    </div>
                )) : <p className="text-xs text-muted-foreground text-center pt-4">No asignado</p>}
            </div>
        </div>
    );

    return (
        <Card className="font-light break-inside-avoid">
            <CardHeader>
                <CardTitle className="flex justify-center items-center text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {renderColumn(confeccionItems, 'CONFECCIÓN')}
                    {renderColumn(paqueteriaItems, 'PAQUETERÍA')}
                </div>
            </CardContent>
        </Card>
    );
};


function PrintPlanificacionPageComponent() {
  const searchParams = useSearchParams();
  const weekId = searchParams.get('week') || '';
  const day = searchParams.get('day') || 'lunes';

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

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100 text-zinc-900">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100 text-zinc-900" >
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!data || !data.productividad) {
    return null;
  }
  
  const dayData = data.productividad[day as 'lunes' | 'jueves'];
  if (!dayData) {
      return (
          <div className="flex h-screen w-screen items-center justify-center bg-gray-100 text-zinc-900" >
             <p className="text-xl text-red-500">No se encontraron datos para el día seleccionado.</p>
          </div>
      )
  }

  const womanPlanificacion = dayData.planificacion.filter(p => p.seccion === 'woman');
  const manPlanificacion = dayData.planificacion.filter(p => p.seccion === 'man');
  const ninoPlanificacion = dayData.planificacion.filter(p => p.seccion === 'nino');
  

  return (
    <div className="bg-white p-8 w-full min-h-screen text-zinc-900 font-aptos" style={{ fontFamily: "'Aptos', sans-serif"}}>
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
             @page {
                size: landscape;
                margin: 1cm;
            }
          }
        `}
      </style>

      <header className="mb-6 flex justify-between items-center">
         <div className="text-left">
            <h1 className="text-3xl font-bold tracking-tight">PLANIFICACIÓN {day.toUpperCase()}</h1>
            <p className="text-lg text-gray-500">{formatWeekIdToDateRange(weekId)}</p>
         </div>
         <Image src="/Zara_Logo.svg.png" alt="Zara Logo" width={200} height={44} />
      </header>

      <main className="grid grid-cols-3 gap-6">
        <PrintSection title="WOMAN" planificacion={womanPlanificacion} />
        <PrintSection title="MAN" planificacion={manPlanificacion} />
        <PrintSection title="NIÑO" planificacion={ninoPlanificacion} />
      </main>

      <footer className="absolute bottom-4 right-8 text-right w-full">
        <p className="text-xs">ZARA 1224 - PUERTO VENECIA</p>
      </footer>
    </div>
  );
}

export default function PrintPlanificacionPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-white">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        }>
            <PrintPlanificacionPageComponent />
        </Suspense>
    );
}
