
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getInitialDataForWeek, getInitialLists, type WeeklyData, type ProductividadData } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { Loader2, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


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
  const [error, setError] = useState<string | null>(null);
  
  const handleGeneratePDF = () => {
    if (!data || !data.productividad || !data.listas || !data.listas.productividadRatio) return;

    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const dayData = data.productividad[day as 'lunes' | 'jueves'];
    const ratios = data.listas.productividadRatio;
    
    // Header
    doc.setFontSize(18);
    doc.text(`PRODUCTIVIDAD ${day.toUpperCase()}`, 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`ZARA 1224 - PUERTO VENECIA`, 105, 26, { align: 'center' });
    
    const ratioConfeccion = ratios.confeccion || 120;
    const ratioPerchado = ratios.perchado || 80;
    const ratioPicking = ratios.picking || 400;
    const porcentajePerchado = (ratios.porcentajePerchado || 40) / 100;
    const porcentajePicking = (ratios.porcentajePicking || 60) / 100;

    const sections = ['woman', 'man', 'nino'] as const;

    const productividadData = sections.map(sec => {
        const unidadesConfeccion = dayData.productividadPorSeccion[sec]?.unidadesConfeccion || 0;
        const unidadesPaqueteria = dayData.productividadPorSeccion[sec]?.unidadesPaqueteria || 0;
        const horasConfeccion = unidadesConfeccion / ratioConfeccion;
        const unidadesPerchado = unidadesPaqueteria * porcentajePerchado;
        const horasPerchado = unidadesPerchado / ratioPerchado;
        const unidadesPicking = unidadesPaqueteria * porcentajePicking;
        const horasPicking = unidadesPicking / ratioPicking;
        return { 
            title: sec.toUpperCase(),
            unidadesConfeccion, horasConfeccion, unidadesPaqueteria, unidadesPerchado, horasPerchado, unidadesPicking, horasPicking 
        };
    });

    const bodyData = productividadData.flatMap(sec => [
        { section: sec.title, tarea: 'Confección', unidades: formatNumber(sec.unidadesConfeccion), ratio: `${ratioConfeccion} u/h`, horas: `${roundToQuarter(sec.horasConfeccion)} h` },
        { section: '', tarea: 'Paquetería (Perchado)', unidades: formatNumber(sec.unidadesPerchado), ratio: `${ratioPerchado} u/h`, horas: `${roundToQuarter(sec.horasPerchado)} h` },
        { section: '', tarea: 'Paquetería (Picking)', unidades: formatNumber(sec.unidadesPicking), ratio: `${ratioPicking} u/h`, horas: `${roundToQuarter(sec.horasPicking)} h` },
    ]);

    const horasProductividadRequeridas = productividadData.reduce((sum, d) => sum + d.horasConfeccion + d.horasPerchado + d.horasPicking, 0);

    autoTable(doc, {
        startY: 35,
        head: [['Sección', 'Tarea', 'Unidades', 'Productividad', 'Horas Req.']],
        body: bodyData.map(d => [d.section, d.tarea, d.unidades, d.ratio, d.horas]),
        theme: 'grid',
        headStyles: { fillColor: [73, 175, 165] },
        didDrawCell: (data) => {
            if (data.row.index % 3 === 0 && data.section === 'body') {
                doc.line(data.cell.x, data.cell.y, data.cell.x + data.cell.width, data.cell.y);
            }
        },
        foot: [['TOTAL HORAS PRODUCTIVIDAD REQUERIDAS', '', '', '', `${roundToQuarter(horasProductividadRequeridas)} h`]],
        footStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: 'bold' }
    });

    doc.save(`productividad_${day}.pdf`);
  };

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
        
        let reportData: WeeklyData;
        
        if (reportSnap.exists()) {
            reportData = reportSnap.data() as WeeklyData;
        } else {
            setError(`No se encontró ningún informe para la semana "${weekId}".`);
            setLoading(false);
            return;
        }

        if (listsSnap.exists()) {
            reportData.listas = listsSnap.data() as WeeklyData['listas'];
        } else {
            console.warn(`No lists config found, using initial data structure for printing.`);
            reportData.listas = getInitialLists();
        }

        if (!reportData.listas.productividadRatio) {
            reportData.listas.productividadRatio = getInitialLists().productividadRatio;
        }

        setData(reportData);


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
        <p className="ml-4 text-lg">Cargando informe para generar PDF...</p>
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
    return (
         <div className="flex h-screen w-screen items-center justify-center bg-white text-zinc-900" >
            <p className="text-xl text-red-500">Faltan datos de productividad o ratios para generar el informe.</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-4">Generar PDF de Productividad</h1>
            <p className="mb-8 text-muted-foreground">El informe para la semana <span className="font-semibold">{weekId}</span> y el día <span className="font-semibold">{day}</span> está listo para ser generado.</p>
            <Button onClick={handleGeneratePDF} size="lg">
                <Share className="mr-2 h-5 w-5" />
                Descargar PDF
            </Button>
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