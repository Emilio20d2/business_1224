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
import { DatosPorSeccionTab } from "@/components/dashboard/datos-por-seccion-tab";
import { VentasManTab } from "@/components/dashboard/ventas-man-tab";
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns';
import { es } from 'date-fns/locale';

const getPreviousWeekRange = () => {
    const today = new Date();
    const lastWeek = subWeeks(today, 1);
    const start = startOfWeek(lastWeek, { weekStartsOn: 1 }); // Lunes
    const end = endOfWeek(lastWeek, { weekStartsOn: 1 }); // Domingo
    return {
      start: format(start, 'd MMM', { locale: es }),
      end: format(end, 'd MMM, yyyy', { locale: es }),
    };
};

export default function Home() {
  const [data, setData] = React.useState<WeeklyData>(datosSemanales["semana-24"]);
  const [isEditing, setIsEditing] = React.useState(false);
  const [week, setWeek] = React.useState("semana-24");
  
  const previousWeek = getPreviousWeekRange();
  const weekLabel = `${previousWeek.start} - ${previousWeek.end}`;

  const handleWeekChange = (newWeek: string) => {
    setWeek(newWeek);
    setData(datosSemanales[newWeek as keyof typeof datosSemanales]);
  };

  const handleSave = () => {
    // Logic to save data will be implemented in Phase 3
    console.log("Saving data...");
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Logic to cancel changes
    console.log("Canceling edit...");
    setIsEditing(false);
    // Restore original data if it was modified in state
    setData(datosSemanales[week as keyof typeof datosSemanales]);
  };

  // The lists that will populate the select dropdowns in edit mode
  const listOptions = {
    comprador: datosSemanales['semana-24'].ventasMan.pesoComprador.map(item => item.nombre),
    zonaComercial: datosSemanales['semana-24'].ventasMan.zonaComercial.map(item => item.nombre),
    agrupacionComercial: datosSemanales['semana-24'].ventasMan.agrupacionComercial.map(item => item.nombre),
  };

  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-background">
      <header className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Insight Board
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="semana-select" className="text-sm font-medium text-muted-foreground">Informe:</label>
             <Select value="previous-week">
              <SelectTrigger id="semana-select" className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous-week">{weekLabel}</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">Guardar</Button>
                <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">Editar</Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Editar Listas de Categorías</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                      <span>COMPRADOR</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                      <span>ZONA COMPRADOR</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                      <span>AGRUPACION COMERCIAL</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main>
        <Tabs defaultValue="datosSemanales">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 mb-4">
            <TabsTrigger value="datosSemanales">Datos Semanales</TabsTrigger>
            <TabsTrigger value="ventasSeccion">Ventas Sección</TabsTrigger>
            <TabsTrigger value="ventasMan">Ventas Man</TabsTrigger>
            <TabsTrigger value="aqneSemanal" disabled>AQNE Semanal</TabsTrigger>
            <TabsTrigger value="acumulado" disabled>Acumulado</TabsTrigger>
          </TabsList>
          <TabsContent value="datosSemanales">
            <DatosSemanalesTab data={data} isEditing={isEditing} />
          </TabsContent>
          <TabsContent value="ventasSeccion">
             <DatosPorSeccionTab data={data.datosPorSeccion} />
          </TabsContent>
           <TabsContent value="ventasMan">
             <VentasManTab data={data.ventasMan} isEditing={isEditing} />
          </TabsContent>
           <TabsContent value="aqneSemanal">
             {/* This content will be added in a future step */}
          </TabsContent>
           <TabsContent value="acumulado">
             {/* This content will be added in a future step */}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
