
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { WeeklyData, PlanificacionItem } from '@/lib/data';
import { formatNumber } from '@/lib/format';
import { Loader2, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


function PrintPlanificacionPageComponent() {
  const searchParams = useSearchParams();
  const weekId = searchParams.get('week') || '';
  const day = searchParams.get('day') || 'lunes';

  const [data, setData] = useState<WeeklyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePDF = () => {
    if (!data || !data.productividad) return;

    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const dayData = data.productividad[day as 'lunes' | 'jueves'];
    
    // Header
    doc.setFontSize(18);
    doc.text(`PLANIFICACIÓN ${day.toUpperCase()}`, 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`ZARA 1224 - PUERTO VENECIA`, 105, 26, { align: 'center' });
    
    let lastY = 35;

    ['woman', 'man', 'nino'].forEach(section => {
        const sectionData = dayData.productividadPorSeccion[section as keyof typeof dayData.productividadPorSeccion];
        const planificacionSeccion = dayData.planificacion.filter(p => p.seccion === section);
        
        const confeccionItems = planificacionSeccion.filter(p => p.tarea === 'confeccion');
        const paqueteriaItems = planificacionSeccion.filter(p => p.tarea === 'paqueteria');

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(section.toUpperCase(), 15, lastY);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Un. Confección: ${formatNumber(sectionData?.unidadesConfeccion) || 0}`, 15, lastY + 5);
        doc.text(`Un. Paquetería: ${formatNumber(sectionData?.unidadesPaqueteria) || 0}`, 60, lastY + 5);
        
        lastY += 10;

        // Confección
        autoTable(doc, {
            startY: lastY,
            head: [['CONFECCIÓN']],
            body: confeccionItems.map(item => [`${item.nombreEmpleado || '--'}\n  ${item.anotaciones || ''}`]),
            theme: 'striped',
            headStyles: { fillColor: [73, 175, 165] }, // Teal color
            styles: { cellPadding: 2, fontSize: 8 },
            columnStyles: { 0: { cellWidth: 88 } },
            margin: { left: 15 },
            tableWidth: 'wrap'
        });

        // Paquetería
        autoTable(doc, {
            startY: lastY,
            head: [['PAQUETERÍA']],
            body: paqueteriaItems.map(item => [`${item.nombreEmpleado || '--'}\n  ${item.anotaciones || ''}`]),
            theme: 'striped',
            headStyles: { fillColor: [73, 175, 165] },
            styles: { cellPadding: 2, fontSize: 8 },
            columnStyles: { 0: { cellWidth: 88 } },
            margin: { left: 107 },
            tableWidth: 'wrap'
        });

        const confeccionTableHeight = (doc as any).lastAutoTable.finalY;
        const paqueteriaTableHeight = (doc as any).lastAutoTable.finalY;

        lastY = Math.max(confeccionTableHeight, paqueteriaTableHeight) + 10;
    });

    doc.save(`planificacion_${day}.pdf`);
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

  if (!data || !data.productividad) {
    return null;
  }
  
  return (
    <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-4">Generar PDF de Planificación</h1>
            <p className="mb-8 text-muted-foreground">El informe para la semana <span className="font-semibold">{weekId}</span> y el día <span className="font-semibold">{day}</span> está listo para ser generado.</p>
            <Button onClick={handleGeneratePDF} size="lg">
                <Share className="mr-2 h-5 w-5" />
                Descargar PDF
            </Button>
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