"use client"
import React from 'react';
import { datosSemanales, type WeeklyData } from "@/lib/data";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatosSemanalesTab } from "@/components/dashboard/datos-semanales-tab";
import { AlmacenTab } from "@/components/dashboard/almacen-tab";
import { Button } from '@/components/ui/button';

export default function Home() {
  const data: WeeklyData = datosSemanales;
  const [isEditing, setIsEditing] = React.useState(false);
  const [week, setWeek] = React.useState("semana-24");

  const handleSave = () => {
    // Logic to save data will be implemented in Phase 3
    console.log("Saving data...");
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Logic to cancel changes
    console.log("Canceling edit...");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-background">
      <header className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Dashboard Semanal
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="semana-select" className="text-sm font-medium">Seleccionar Informe:</label>
            <Select value={week} onValueChange={setWeek}>
              <SelectTrigger id="semana-select" className="w-[180px]">
                <SelectValue placeholder="Seleccionar semana" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana-24">Semana 24</SelectItem>
                {/* Future weeks will be populated here */}
              </SelectContent>
            </Select>
          </div>
           <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Guardar Cambios</Button>
                <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Editar</Button>
            )}
          </div>
        </div>
      </header>
      
      <main>
        <Tabs defaultValue="datosSemanales">
          <TabsList>
            <TabsTrigger value="datosSemanales">Datos Semanales</TabsTrigger>
            <TabsTrigger value="almacenes">Almacenes</TabsTrigger>
          </TabsList>
          <TabsContent value="datosSemanales">
            <DatosSemanalesTab data={data} isEditing={isEditing} />
          </TabsContent>
          <TabsContent value="almacenes">
            <AlmacenTab data={data.almacenes} isEditing={isEditing} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
