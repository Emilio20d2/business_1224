
'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { WeeklyData, PlanificacionItem } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { Loader2, Share } from 'lucide-react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PrintSection = ({
    title,
    planificacion,
    unidadesConfeccion,
    unidadesPaqueteria,
}: {
    title: string;
    planificacion: PlanificacionItem[];
    unidadesConfeccion: number;
    unidadesPaqueteria: number;
}) => {
    const safePlanificacion = Array.isArray(planificacion) ? planificacion : [];
    const confeccionItems = safePlanificacion.filter(p => p.tarea === 'confeccion');
    const paqueteriaItems = safePlanificacion.filter(p => p.tarea === 'paqueteria');

    const renderColumn = (items: PlanificacionItem[], columnTitle: string) => (
        <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-center text-muted-foreground uppercase text-sm mb-2">{columnTitle}</h3>
            <div className="flex flex-col text-sm">
                {items.length > 0 ? items.map(item => (
                     <div key={item.id} className="flex flex-col mb-1">
                        <p className="font-medium text-sm">{item.nombreEmpleado || '--'}</p>
                        {item.anotaciones && (
                            <p className="text-sm text-muted-foreground pl-4">{item.anotaciones}</p>
                        )}
                    </div>
                )) : <p className="text-xs text-muted-foreground text-center pt-4">No asignado</p>}
            </div>
        </div>
    );

    return (
        <Card className="font-light break-inside-avoid">
            <CardHeader className="pb-2">
                <CardTitle className="flex flex-col justify-center items-center text-base">
                    <span>{title}</span>
                    <div className="flex justify-around items-center w-full text-xs font-normal text-muted-foreground mt-2">
                        <span>Un. Confección: <strong className="text-foreground">{formatNumber(unidadesConfeccion)}</strong></span>
                        <span>Un. Paquetería: <strong className="text-foreground">{formatNumber(unidadesPaqueteria)}</strong></span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-6">
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
  const printRef = useRef<HTMLDivElement>(null);


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
      <div className="flex h-screen w-screen items-center justify-center bg-white text-zinc-900">
        <Loader2 className="h-16 w-16 animate-spin" />
        <p className="ml-4 text-lg">Cargando informe...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white text-zinc-900" >
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
          <div className="flex h-screen w-screen items-center justify-center bg-white text-zinc-900" >
             <p className="text-xl text-red-500">No se encontraron datos para el día seleccionado.</p>
          </div>
      )
  }

  const womanPlanificacion = dayData.planificacion?.filter(p => p.seccion === 'woman') || [];
  const manPlanificacion = dayData.planificacion?.filter(p => p.seccion === 'man') || [];
  const ninoPlanificacion = dayData.planificacion?.filter(p => p.seccion === 'nino') || [];
  

  return (
    <div className="bg-gray-100 min-h-screen">
      <div ref={printRef} className="bg-white p-8 w-[1123px] min-h-[794px] mx-auto my-8 text-zinc-900 font-aptos" style={{ fontFamily: "'Aptos', sans-serif"}}>
          <header className="mb-6 flex justify-between items-center">
            <div className="text-left">
                <h1 className="text-3xl font-bold tracking-tight">PLANIFICACIÓN {day.toUpperCase()}</h1>
            </div>
            <Image src="/Zara_Logo.svg.png" alt="Zara Logo" width={200} height={44} />
          </header>

          <main className="grid grid-cols-3 gap-4">
             <PrintSection 
                title="WOMAN" 
                planificacion={womanPlanificacion}
                unidadesConfeccion={dayData.productividadPorSeccion?.woman?.unidadesConfeccion || 0}
                unidadesPaqueteria={dayData.productividadPorSeccion?.woman?.unidadesPaqueteria || 0}
            />
            <PrintSection 
                title="MAN" 
                planificacion={manPlanificacion}
                unidadesConfeccion={dayData.productividadPorSeccion?.man?.unidadesConfeccion || 0}
                unidadesPaqueteria={dayData.productividadPorSeccion?.man?.unidadesPaqueteria || 0}
            />
            <PrintSection 
                title="NIÑO" 
                planificacion={ninoPlanificacion} 
                unidadesConfeccion={dayData.productividadPorSeccion?.nino?.unidadesConfeccion || 0}
                unidadesPaqueteria={dayData.productividadPorSeccion?.nino?.unidadesPaqueteria || 0}
            />
          </main>

          <footer className="absolute bottom-4 right-8 text-right">
            <p className="text-xs">ZARA 1224 - PUERTO VENECIA</p>
          </footer>
      </div>
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
