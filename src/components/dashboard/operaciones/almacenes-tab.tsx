
"use client";

import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { OperacionesSubTab } from '../operaciones-sub-tab';
import { KpiCard } from '../kpi-card';
import { Warehouse } from 'lucide-react';
import { FilaModulo, ModuloAlmacen, ModuloContenidoGrande } from '../operaciones-sub-tab';
import { Footprints, PackageCheck, Shirt, SprayCan, Truck, FileInput } from 'lucide-react';

const AlmacenCard = ({ basePath, logistica, almacenes, isEditing, onInputChange }: { basePath: 'woman' | 'man' | 'nino', logistica: any, almacenes: any, isEditing: boolean, onInputChange: any }) => (
    <KpiCard title="ALMACENES" icon={<Warehouse className="h-5 w-5 text-primary" />} className="md:col-span-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1.5fr_1.5fr] gap-6 place-items-start">
          <ModuloAlmacen title="Entradas">
            <ModuloContenidoGrande icon={<Truck className="h-8 w-8 text-primary"/>} value={logistica.entradasSemanales} isEditing={isEditing} id={`${basePath}.logistica.entradasSemanales`} onInputChange={onInputChange} />
          </ModuloAlmacen>
          <ModuloAlmacen title="DEV. ALMACEN">
            <ModuloContenidoGrande icon={<PackageCheck className="h-8 w-8 text-primary"/>} value={logistica.salidasSemanales} isEditing={isEditing} id={`${basePath}.logistica.salidasSemanales`} onInputChange={onInputChange} />
          </ModuloAlmacen>
          <ModuloAlmacen title="SINT">
            <ModuloContenidoGrande icon={<FileInput className="h-8 w-8 text-primary"/>} value={logistica.sintSemanales} isEditing={isEditing} id={`${basePath}.logistica.sintSemanales`} onInputChange={onInputChange} />
          </ModuloAlmacen>
          <ModuloAlmacen title="Ocupación" className="w-full">
            <FilaModulo icon={<Shirt className="h-5 w-5"/>} label="Ropa" value={almacenes.ropa.ocupacionPorc} isEditing={isEditing} id={`${basePath}.almacenes.ropa.ocupacionPorc`} onInputChange={onInputChange} unit="%" />
            <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={almacenes.calzado.ocupacionPorc} isEditing={isEditing} id={`${basePath}.almacenes.calzado.ocupacionPorc`} onInputChange={onInputChange} unit="%" />
            <FilaModulo icon={<SprayCan className="h-5 w-5"/>} label="Perfumería" value={almacenes.perfumeria.ocupacionPorc} isEditing={isEditing} id={`${basePath}.almacenes.perfumeria.ocupacionPorc`} onInputChange={onInputChange} unit="%" />
          </ModuloAlmacen>
          <ModuloAlmacen title="Propuesta Devo." className="w-full">
             <FilaModulo icon={<Shirt className="h-5 w-5"/>} label="Ropa" value={almacenes.ropa.devolucionUnidades as number} isEditing={isEditing} id={`${basePath}.almacenes.ropa.devolucionUnidades`} onInputChange={onInputChange} unit="Unid."/>
             <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={almacenes.calzado.devolucionUnidades as number} isEditing={isEditing} id={`${basePath}.almacenes.calzado.devolucionUnidades`} onInputChange={onInputChange} unit="Unid."/>
          </ModuloAlmacen>
        </div>
      </KpiCard>
)


export function AlmacenesTab({ data, isEditing, onInputChange }: { data: WeeklyData, isEditing: boolean, onInputChange: any }) {
  if (!data) return null;

  return (
    <div className="space-y-4">
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
