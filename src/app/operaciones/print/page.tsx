
'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { WeeklyData, PlanificacionItem } from '@/lib/data';
import { formatWeekIdToDateRange, formatNumber } from '@/lib/format';
import { Loader2, Download } from 'lucide-react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
        <div className="flex flex-col gap-2 px-2">
            <h3 className="font-bold text-center text-muted-foreground uppercase text-sm">{columnTitle}</h3>
            <div className="flex flex-col gap-2 text-sm min-h-[100px]">
                {items.length > 0 ? items.map(item => (
                    <div key={item.id} className="grid grid-cols-[1fr_1fr] items-center">
                        <p className="font-medium text-sm">{item.nombreEmpleado || '--'}</p>
                        <p className="text-sm text-muted-foreground">{item.anotaciones || '--'}</p>
                    </div>
                )) : <p className="text-xs text-muted-foreground text-center pt-4">No asignado</p>}
            </div>
        </div>
    );

    return (
        <Card className="font-light break-inside-avoid shadow-none border-none">
            <CardHeader>
                <CardTitle className="flex flex-col justify-center items-center text-base">
                    <span>{title}</span>
                    <div className="flex justify-around items-center gap-4 text-xs font-normal text-muted-foreground mt-2">
                        <span>Un. Confección: <strong className="text-foreground">{formatNumber(unidadesConfeccion)}</strong></span>
                        <span>Un. Paquetería: <strong className="text-foreground">{formatNumber(unidadesPaqueteria)}</strong></span>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2">
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
  const [isDownloading, setIsDownloading] = useState(false);
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

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;
    
    setIsDownloading(true);

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Aumenta la resolución
            useCORS: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // A4 landscape dimensions in mm: 297 x 210
        const pdf = new jsPDF('landscape', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;
        
        const ratio = imgWidth / imgHeight;
        
        let newImgWidth = pdfWidth;
        let newImgHeight = newImgWidth / ratio;
        
        if (newImgHeight > pdfHeight) {
            newImgHeight = pdfHeight;
            newImgWidth = newImgHeight * ratio;
        }

        const xOffset = (pdfWidth - newImgWidth) / 2;
        const yOffset = (pdfHeight - newImgHeight) / 2;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, newImgWidth, newImgHeight);
        pdf.save('planificacion.pdf');
    } catch (error) {
        console.error("Error al generar el PDF:", error);
        setError("No se pudo generar el PDF. Inténtalo de nuevo.");
    } finally {
        setIsDownloading(false);
    }
  };


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
      <div className="bg-white shadow py-4 px-8 sticky top-0 z-20 flex justify-center items-center">
        <Button onClick={handleDownloadPdf} disabled={isDownloading}>
            {isDownloading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                </>
            ) : (
                <>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                </>
            )}
        </Button>
      </div>
      <div ref={printRef} className="bg-white p-8 w-[1123px] min-h-[794px] mx-auto my-8 text-zinc-900 font-aptos" style={{ fontFamily: "'Aptos', sans-serif"}}>
          <header className="mb-6 flex justify-between items-center">
            <div className="text-left">
                <h1 className="text-3xl font-bold tracking-tight">PLANIFICACIÓN {day.toUpperCase()}</h1>
                <p className="text-lg text-gray-500">{formatWeekIdToDateRange(weekId)}</p>
            </div>
            <Image src="/Zara_Logo.svg.png" alt="Zara Logo" width={200} height={44} />
          </header>

          <main className="grid grid-cols-3 gap-6">
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
