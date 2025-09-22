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
import { analyzeWeeklyTrends } from '@/ai/flows/analyze-weekly-trends';
import { WeeklyAnalysisOutput } from '@/ai/flows/analyze-weekly-trends';
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
  const [analysis, setAnalysis] = React.useState<WeeklyAnalysisOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = React.useState(false);

  const previousWeek = getPreviousWeekRange();
  const weekLabel = `${previousWeek.start} - ${previousWeek.end}`;

  const handleWeekChange = (newWeek: string) => {
    setWeek(newWeek);
    setData(datosSemanales[newWeek as keyof typeof datosSemanales]);
    setAnalysis(null); // Reset analysis when week changes
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
  
  const getAIAnalysis = async () => {
    setIsLoadingAnalysis(true);
    setAnalysis(null);
    try {
      const result = await analyzeWeeklyTrends({
        currentWeekData: datosSemanales['semana-24'],
        previousWeekData: datosSemanales['semana-23'],
      });
      setAnalysis(result);
    } catch (error) {
      console.error("Error getting AI analysis:", error);
    } finally {
      setIsLoadingAnalysis(false);
    }
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
                <DropdownMenuLabel>Configuración</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">COMPRADOR</DropdownMenuLabel>
                  {/* Items para Comprador */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">ZONA COMPRADOR</DropdownMenuLabel>
                  {/* Items para Zona Comprador */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">AGRUPACION COMERCIAL</DropdownMenuLabel>
                  {/* Items para Agrupacion Comercial */}
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
