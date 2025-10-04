
"use client";

import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { OperacionesSubTab } from '../operaciones-sub-tab';
import { KpiCard } from '../kpi-card';
import { Warehouse, FileInput, Truck, PackageCheck, Repeat, Box, Archive } from 'lucide-react';
import { FilaModulo, ModuloAlmacen, ModuloContenidoGrande } from '../operaciones-sub-tab';
import { Footprints, Shirt, SprayCan } from 'lucide-react';
import { formatNumber } from '@/lib/format';

const AlmacenCard = ({ basePath, logistica, almacenes, isEditing, onInputChange }: { basePath: 'general' | 'woman' | 'man' | 'nino' | 'total', logistica: any, almacenes: any, isEditing: boolean, onInputChange: any }) => {
    const balance = (logistica.entradasSemanales || 0) - (logistica.sintSemanales || 0);

    // Ensure almacenes and its properties exist
    const safeAlmacenes = almacenes || {};
    const paqueteria = safeAlmacenes.paqueteria || { ocupacionPorc: 0, devolucionUnidades: 0 };
    const confeccion = safeAlmacenes.confeccion || { ocupacionPorc: 0, devolucionUnidades: 0 };
    const calzado = safeAlmacenes.calzado || { ocupacionPorc: 0, devolucionUnidades: 0 };
    const perfumeria = safeAlmacenes.perfumeria || { ocupacionPorc: 0, devolucionUnidades: null };

    const isTotalCard = basePath === 'total';

    return (
        <KpiCard title="ALMACENES" icon={<Warehouse className="h-5 w-5 text-primary" />} className="md:col-span-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1.5fr_1.5fr] gap-6 place-items-start">
              <ModuloAlmacen title="Entradas">
                <ModuloContenidoGrande icon={<Truck className="h-8 w-8 text-primary"/>} value={logistica.entradasSemanales} isEditing={!isTotalCard && isEditing} id={`${basePath}.logistica.entradasSemanales`} onInputChange={onInputChange} />
              </ModuloAlmacen>
              <ModuloAlmacen title="Salidas">
                <ModuloContenidoGrande icon={<PackageCheck className="h-8 w-8 text-primary"/>} value={logistica.sintSemanales} isEditing={!isTotalCard && isEditing} id={`${basePath}.logistica.sintSemanales`} onInputChange={onInputChange} />
              </ModuloAlmacen>
              <ModuloAlmacen title="Balance">
                 <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background h-full">
                   <div className="text-primary"><Repeat className="h-8 w-8 text-primary"/></div>
                   <strong className="text-3xl font-bold">{formatNumber(balance)}</strong>
                </div>
              </ModuloAlmacen>
               <ModuloAlmacen title="DEVOS.">
                <ModuloContenidoGrande icon={<FileInput className="h-8 w-8 text-primary"/>} value={logistica.salidasSemanales} isEditing={!isTotalCard && isEditing} id={`${basePath}.logistica.salidasSemanales`} onInputChange={onInputChange} />
              </ModuloAlmacen>
              <ModuloAlmacen title="Ocupación" className="w-full">
                <FilaModulo icon={<Archive className="h-5 w-5"/>} label="Paque." value={paqueteria.ocupacionPorc} isEditing={isEditing} id={`${basePath}.almacenes.paqueteria.ocupacionPorc`} onInputChange={onInputChange} unit="%" />
                <FilaModulo icon={<Box className="h-5 w-5"/>} label="Confe." value={confeccion.ocupacionPorc} isEditing={isEditing} id={`${basePath}.almacenes.confeccion.ocupacionPorc`} onInputChange={onInputChange} unit="%" />
                <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={calzado.ocupacionPorc} isEditing={isEditing} id={`${basePath}.almacenes.calzado.ocupacionPorc`} onInputChange={onInputChange} unit="%" />
                <FilaModulo icon={<SprayCan className="h-5 w-5"/>} label="Perfu." value={perfumeria.ocupacionPorc} isEditing={isEditing} id={`${basePath}.almacenes.perfumeria.ocupacionPorc`} onInputChange={onInputChange} unit="%" />
              </ModuloAlmacen>
              <ModuloAlmacen title="Propuesta Devo." className="w-full">
                 <FilaModulo icon={<Archive className="h-5 w-5"/>} label="Paque." value={paqueteria.devolucionUnidades as number} isEditing={!isTotalCard && isEditing} id={`${basePath}.almacenes.paqueteria.devolucionUnidades`} onInputChange={onInputChange} unit="Unid."/>
                 <FilaModulo icon={<Box className="h-5 w-5"/>} label="Confe." value={confeccion.devolucionUnidades as number} isEditing={!isTotalCard && isEditing} id={`${basePath}.almacenes.confeccion.devolucionUnidades`} onInputChange={onInputChange} unit="Unid."/>
                 <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={calzado.devolucionUnidades as number} isEditing={!isTotalCard && isEditing} id={`${basePath}.almacenes.calzado.devolucionUnidades`} onInputChange={onInputChange} unit="Unid."/>
              </ModuloAlmacen>
            </div>
          </KpiCard>
    )
}


export function AlmacenesTab({ data, isEditing, onInputChange }: { data: WeeklyData, isEditing: boolean, onInputChange: any }) {
  if (!data) return null;
  
  const sections = ['woman', 'man', 'nino'] as const;
  
  const totalLogistica = {
      entradasSemanales: sections.reduce((sum, key) => sum + (data[key]?.logistica?.entradasSemanales || 0), 0),
      salidasSemanales: sections.reduce((sum, key) => sum + (data[key]?.logistica?.salidasSemanales || 0), 0),
      sintSemanales: sections.reduce((sum, key) => sum + (data[key]?.logistica?.sintSemanales || 0), 0),
  };
  
  const totalAlmacenes = {
      paqueteria: {
          devolucionUnidades: sections.reduce((sum, key) => sum + (data[key]?.almacenes?.paqueteria?.devolucionUnidades || 0), 0),
          ocupacionPorc: data.general?.almacenes?.paqueteria?.ocupacionPorc || 0,
      },
      confeccion: {
          devolucionUnidades: sections.reduce((sum, key) => sum + (data[key]?.almacenes?.confeccion?.devolucionUnidades || 0), 0),
          ocupacionPorc: data.general?.almacenes?.confeccion?.ocupacionPorc || 0,
      },
      calzado: {
          devolucionUnidades: sections.reduce((sum, key) => sum + (data[key]?.almacenes?.calzado?.devolucionUnidades || 0), 0),
          ocupacionPorc: data.general?.almacenes?.calzado?.ocupacionPorc || 0,
      },
      perfumeria: {
          devolucionUnidades: null,
          ocupacionPorc: data.general?.almacenes?.perfumeria?.ocupacionPorc || 0,
      }
  };


  return (
    <div className="space-y-4">
       <div>
        <h2 className="text-xl font-bold mb-2">GENERAL</h2>
        <AlmacenCard 
            logistica={totalLogistica}
            almacenes={totalAlmacenes}
            isEditing={isEditing} 
            onInputChange={onInputChange}
            basePath="general"
        />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">WOMAN</h2>
        <AlmacenCard 
            logistica={data.woman.logistica}
            almacenes={data.woman.almacenes}
            isEditing={isEditing} 
            onInputChange={onInputChange}
            basePath="woman"
        />
      </div>
       <div>
        <h2 className="text-xl font-bold mb-2">MAN</h2>
        <AlmacenCard 
            logistica={data.man.logistica}
            almacenes={data.man.almacenes}
            isEditing={isEditing} 
            onInputChange={onInputChange}
            basePath="man"
        />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">NIÑO</h2>
        <AlmacenCard 
            logistica={data.nino.logistica}
            almacenes={data.nino.almacenes}
            isEditing={isEditing} 
            onInputChange={onInputChange}
            basePath="nino"
        />
      </div>
    </div>
  );
}
