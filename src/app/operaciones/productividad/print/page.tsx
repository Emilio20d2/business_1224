
'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { WeeklyData, ProductividadData } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { Loader2, Download, Box, Zap } from 'lucide-react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KpiCard } from '@/components/dashboard/kpi-card';

const roundToQuarter = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '0.00';
    return (Math.round(value * 4) / 4).toFixed(2);
}

function PrintProductividadPageComponent() {
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
        const listsRef = doc(db, "configuracion", "listas");

        const [reportSnap, listsSnap] = await Promise.all([
            getDoc(reportRef),
            getDoc(listsRef),
        ]);

        if (reportSnap.exists() && listsSnap.exists()) {
          const reportData = reportSnap.data() as WeeklyData;
          reportData.listas = listsSnap.data() as WeeklyData['listas'];
          setData(reportData);
        } else {
          setError(`No se encontró ningún informe o configuración para la semana "${weekId}".`);
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
            scale: 2, 
            useCORS: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;
        
        const ratio = imgHeight / imgWidth;
        let newImgWidth = pdfWidth - 20; // margins
        let newImgHeight = newImgWidth * ratio;

        if (newImgHeight > pdfHeight - 20) {
            newImgHeight = pdfHeight - 20;
            newImgWidth = newImgHeight / ratio;
        }

        const xOffset = (pdfWidth - newImgWidth) / 2;
        const yOffset = 10;

        pdf.addImage(imgData, 'PNG', xOffset, yOffset, newImgWidth, newImgHeight);
        pdf.save(`productividad_${day}.pdf`);
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

  if (!data || !data.productividad || !data.listas || !data.listas.productividadRatio) {
    return null;
  }
  
  const dayData = data.productividad[day as 'lunes' | 'jueves'];
  const ratios = data.listas.productividadRatio;
  if (!dayData) {
      return (
          <div className="flex h-screen w-screen items-center justify-center bg-white text-zinc-900" >
             <p className="text-xl text-red-500">No se encontraron datos para el día seleccionado.</p>
          </div>
      )
  }

  const ratioConfeccion = ratios?.confeccion || 120;
  const ratioPerchado = ratios?.perchado || 80;
  const ratioPicking = ratios?.picking || 400;
  const porcentajePerchado = (ratios?.porcentajePerchado || 40) / 100;
  const porcentajePicking = (ratios?.porcentajePicking || 60) / 100;

  const sections = [
      { key: 'woman', title: 'WOMAN' },
      { key: 'man', title: 'MAN' },
      { key: 'nino', title: 'NIÑO' },
  ] as const;

  const productividadData = sections.map(sec => {
      const unidadesConfeccion = dayData.productividadPorSeccion[sec.key]?.unidadesConfeccion || 0;
      const unidadesPaqueteria = dayData.productividadPorSeccion[sec.key]?.unidadesPaqueteria || 0;
      const horasConfeccion = unidadesConfeccion / ratioConfeccion;
      const unidadesPerchado = unidadesPaqueteria * porcentajePerchado;
      const horasPerchado = unidadesPerchado / ratioPerchado;
      const unidadesPicking = unidadesPaqueteria * porcentajePicking;
      const horasPicking = unidadesPicking / ratioPicking;
      return { ...sec, unidadesConfeccion, horasConfeccion, unidadesPaqueteria, unidadesPerchado, horasPerchado, unidadesPicking, horasPicking };
  });
  
  const horasProductividadRequeridas = productividadData.reduce((sum, d) => sum + d.horasConfeccion + d.horasPerchado + d.horasPicking, 0);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white shadow py-4 px-8 sticky top-0 z-20 flex justify-center items-center">
        <Button onClick={handleDownloadPdf} disabled={isDownloading}>
            {isDownloading ? ( <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando... </> ) : ( <> <Download className="mr-2 h-4 w-4" /> Descargar PDF </> )}
        </Button>
      </div>
      <div ref={printRef} className="bg-white p-8 w-[210mm] min-h-[297mm] mx-auto my-8 text-zinc-900 font-aptos" style={{ fontFamily: "'Aptos', sans-serif"}}>
          <header className="mb-6 flex justify-between items-center">
            <div className="text-left">
                <h1 className="text-3xl font-bold tracking-tight">PRODUCTIVIDAD {day.toUpperCase()}</h1>
            </div>
            <Image src="/Zara_Logo.svg.png" alt="Zara Logo" width={200} height={44} />
          </header>

          <main className="space-y-4 font-light">
             <div className="grid grid-cols-3 gap-4">
                {productividadData.map(sec => (
                    <Card key={sec.key} className="shadow-none border">
                        <CardHeader>
                            <CardTitle className="text-center">{sec.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                           <p className="text-sm text-muted-foreground">Un. Confección</p>
                           <p className="text-2xl font-bold">{formatNumber(sec.unidadesConfeccion)}</p>
                           <p className="text-sm text-muted-foreground mt-2">Un. Paquetería</p>
                           <p className="text-2xl font-bold">{formatNumber(sec.unidadesPaqueteria)}</p>
                        </CardContent>
                    </Card>
                ))}
             </div>

             <KpiCard title="Desglose de Productividad" icon={<Zap className="h-5 w-5 text-primary" />} className="shadow-none border">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left w-[25%] font-bold">Sección</TableHead>
                            <TableHead className="text-left w-[25%] font-bold">Tarea</TableHead>
                            <TableHead className="text-center w-[15%] font-bold">Unidades</TableHead>
                            <TableHead className="text-center w-[15%] font-bold">Productividad</TableHead>
                            <TableHead className="text-right w-[20%] font-bold">Horas Requeridas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productividadData.map((sec, secIndex) => (
                            <React.Fragment key={sec.key}>
                                <TableRow>
                                    <TableCell rowSpan={3} className="font-bold align-top pt-4 text-base">{sec.title}</TableCell>
                                    <TableCell className="font-medium text-muted-foreground">Confección</TableCell>
                                    <TableCell className="text-center">{formatNumber(sec.unidadesConfeccion)}</TableCell>
                                    <TableCell className="text-center text-muted-foreground">{ratioConfeccion} u/h</TableCell>
                                    <TableCell className="text-right font-medium">{roundToQuarter(sec.horasConfeccion)} h</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-muted-foreground">Paquetería (Perchado)</TableCell>
                                     <TableCell className="text-center">{formatNumber(sec.unidadesPerchado)}</TableCell>
                                    <TableCell className="text-center text-muted-foreground">{ratioPerchado} u/h</TableCell>
                                    <TableCell className="text-right font-medium">{roundToQuarter(sec.horasPerchado)} h</TableCell>
                                </TableRow>
                                <TableRow className={secIndex < sections.length - 1 ? 'border-b-4' : ''}>
                                    <TableCell className="font-medium text-muted-foreground">Paquetería (Picking)</TableCell>
                                    <TableCell className="text-center">{formatNumber(sec.unidadesPicking)}</TableCell>
                                    <TableCell className="text-center text-muted-foreground">{ratioPicking} u/h</TableCell>
                                    <TableCell className="text-right font-medium">{roundToQuarter(sec.horasPicking)} h</TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                         <TableRow className="bg-muted/50 font-bold text-base">
                            <TableCell colSpan={4}>TOTAL HORAS PRODUCTIVIDAD REQUERIDAS</TableCell>
                            <TableCell className="text-right text-lg">{roundToQuarter(horasProductividadRequeridas)} h</TableCell>
                        </TableRow>
                    </TableBody>
                 </Table>
            </KpiCard>
          </main>
      </div>
    </div>
  );
}

export default function PrintProductividadPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-screen items-center justify-center bg-white">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        }>
            <PrintProductividadPageComponent />
        </Suspense>
    );
}
