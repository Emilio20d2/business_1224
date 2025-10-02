
"use client";

import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { OperacionesSubTab } from '../operaciones-sub-tab';

type AlmacenesTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any, reorder?: boolean) => void;
};

export function AlmacenesTab({ data, isEditing, onInputChange }: AlmacenesTabProps) {
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">MAN</h2>
        <OperacionesSubTab 
            operaciones={data.man.operaciones} 
            perdidas={data.man.perdidas}
            logistica={data.man.logistica}
            almacenes={data.man.almacenes}
            isEditing={isEditing} 
            onInputChange={onInputChange}
            basePath="man"
        />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">WOMAN</h2>
        <OperacionesSubTab 
            operaciones={data.woman.operaciones} 
            perdidas={data.woman.perdidas}
            logistica={data.woman.logistica}
            almacenes={data.woman.almacenes}
            isEditing={isEditing} 
            onInputChange={onInputChange}
            basePath="woman"
        />
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">NIÑO</h2>
        <OperacionesSubTab 
            operaciones={data.nino.operaciones} 
            perdidas={data.nino.perdidas}
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
