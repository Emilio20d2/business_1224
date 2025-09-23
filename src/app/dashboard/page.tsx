"use client"
import React, { useState, useContext, useEffect, useCallback } from 'react';
import type { WeeklyData, VentasManItem } from "@/lib/data";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatosSemanalesTab } from "@/components/dashboard/datos-semanales-tab";
import { AqneSemanalTab } from "@/components/dashboard/aqne-semanal-tab";
import { AcumuladoTab } from "@/components/dashboard/acumulado-tab";
import { VentasManTab } from '@/components/dashboard/ventas-man-tab';
import { VentasWomanTab } from '@/components/dashboard/ventas-woman-tab';
import { VentasNinoTab } from '@/components/dashboard/ventas-nino-tab';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, Loader2, ChevronDown, Pencil, Briefcase } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/context/auth-context';
import { getInitialDataForWeek, getInitialLists } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { OperacionesSubTab } from '@/components/dashboard/operaciones-sub-tab';


type EditableList = 'compradorMan' | 'zonaComercialMan' | 'agrupacionComercialMan' | 'compradorWoman' | 'zonaComercialWoman' | 'agrupacionComercialWoman' | 'compradorNino' | 'zonaComercialNino' | 'agrupacionComercialNino';
type TabValue = "datosSemanales" | "aqneSemanal" | "acumulado" | "man" | "woman" | "nino";


const tabLabels: Record<string, string> = {
    datosSemanales: "GENERAL",
    aqneSemanal: "AQNE",
    acumulado: "ACUMULADO",
    man: "MAN",
    woman: "WOMAN",
    nino: "NIÑO",
};

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

const synchronizeTableData = (list: string[], oldTableData: VentasManItem[] = []): VentasManItem[] => {
    if (!Array.isArray(list)) return [];
    // Ensure oldTableData is an array before mapping
    const safeOldTableData = Array.isArray(oldTableData) ? oldTableData : [];
    const oldDataMap = new Map(safeOldTableData.map(item => [item.nombre, item]));
    
    // Create a set of names that are already in use from the old data
    const usedNames = new Set(safeOldTableData.map(item => item.nombre));

    // Map over the old data first to preserve it
    const preservedData = safeOldTableData.map(item => ({ ...item }));

    // Find available names from the main list that are not yet used
    const availableNames = list.filter(name => !usedNames.has(name));

    // Fill the rest of the table up to the list's length with available names
    const needed = list.length - preservedData.length;
    if (needed > 0) {
        for (let i = 0; i < needed; i++) {
            const nameToAdd = availableNames.shift();
            if (nameToAdd) {
                preservedData.push({
                    nombre: nameToAdd,
                    pesoPorc: 0,
                    totalEuros: 0,
                    varPorc: 0,
                    imageUrl: "",
                });
            }
        }
    }
    
    // Trim the data if the list has become shorter
    return preservedData.slice(0, list.length);
};

const synchronizeReportData = (reportData: WeeklyData, listData: WeeklyData['listas']): { updatedData: WeeklyData, hasChanged: boolean } => {
    let hasChanged = false;
    const updatedData = JSON.parse(JSON.stringify(reportData));
    
    // Ensure `listas` is up to date in the report
    updatedData.listas = listData;

    // Define sections to check and synchronize
    const sections: Array<{
        ventasKey: 'ventasMan' | 'ventasWoman' | 'ventasNino';
        listKeys: {
            comprador: keyof WeeklyData['listas'];
            zonaComercial: keyof WeeklyData['listas'];
            agrupacionComercial: keyof WeeklyData['listas'];
        }
    }> = [
        { ventasKey: 'ventasMan', listKeys: { comprador: 'compradorMan', zonaComercial: 'zonaComercialMan', agrupacionComercial: 'agrupacionComercialMan' } },
        { ventasKey: 'ventasWoman', listKeys: { comprador: 'compradorWoman', zonaComercial: 'zonaComercialWoman', agrupacionComercial: 'agrupacionComercialWoman' } },
        { ventasKey: 'ventasNino', listKeys: { comprador: 'compradorNino', zonaComercial: 'zonaComercialNino', agrupacionComercial: 'agrupacionComercialNino' } },
    ];

    for (const section of sections) {
        const { ventasKey, listKeys } = section;
        
        // If the whole ventas section is missing, create it from scratch
        if (!updatedData[ventasKey]) {
            updatedData[ventasKey] = getInitialDataForWeek('temp', listData)[ventasKey];
            hasChanged = true;
        }

        // Sync pesoComprador
        const pesoCompradorList = listData[listKeys.comprador] || [];
        const currentPesoCompradorData = updatedData[ventasKey].pesoComprador || [];
        if (pesoCompradorList.length !== currentPesoCompradorData.length) {
             updatedData[ventasKey].pesoComprador = synchronizeTableData(pesoCompradorList, currentPesoCompradorData);
             hasChanged = true;
        }

        // Sync zonaComercial
        const zonaComercialList = listData[listKeys.zonaComercial] || [];
        const currentZonaComercialData = updatedData[ventasKey].zonaComercial || [];
        if (zonaComercialList.length !== currentZonaComercialData.length) {
             updatedData[ventasKey].zonaComercial = synchronizeTableData(zonaComercialList, currentZonaComercialData);
             hasChanged = true;
        }
        
        // Sync agrupacionComercial
        const agrupacionComercialList = listData[listKeys.agrupacionComercial] || [];
        const currentAgrupacionComercialData = updatedData[ventasKey].agrupacionComercial || [];
        if (agrupacionComercialList.length !== currentAgrupacionComercialData.length) {
             updatedData[ventasKey].agrupacionComercial = synchronizeTableData(agrupacionComercialList, currentAgrupacionComercialData);
             hasChanged = true;
        }
    }

    return { updatedData, hasChanged };
};


export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const router = useRouter();

  const [data, setData] = useState<WeeklyData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [imageLoadingStatus, setImageLoadingStatus] = useState<Record<string, boolean>>({});
  
  const [activeTab, setActiveTab] = useState<string>("datosSemanales");


  const { toast } = useToast();
  
  const fetchData = useCallback(async () => {
    setDataLoading(true);
    setError(null);
    try {
        const week = "semana-24";
        const reportRef = doc(db, "informes", week);
        const listsRef = doc(db, "configuracion", "listas");

        // 1. Get lists configuration
        const listsSnap = await getDoc(listsRef);
        let listData: WeeklyData['listas'];
        if (listsSnap.exists()) {
            listData = listsSnap.data() as WeeklyData['listas'];
        } else {
            // Create initial lists if they don't exist
            listData = getInitialLists();
            await setDoc(listsRef, listData);
        }

        // 2. Get weekly report
        const reportSnap = await getDoc(reportRef);
        let reportData: WeeklyData;
        if (reportSnap.exists()) {
            reportData = reportSnap.data() as WeeklyData;
            // 3. Synchronize report data with list data
            const { updatedData, hasChanged } = synchronizeReportData(reportData, listData);
            if (hasChanged) {
                await setDoc(reportRef, updatedData, { merge: true });
                reportData = updatedData;
            }
        } else {
            // Create initial report if it doesn't exist
            reportData = getInitialDataForWeek(week, listData);
            await setDoc(reportRef, reportData);
        }
        
        setData(reportData);

    } catch (err: any) {
        console.error("Error fetching or setting Firestore document:", err);
        setError(`Error: ${err.message}. Asegúrate de que las reglas de Firestore son correctas.`);
    } finally {
        setDataLoading(false);
    }
  }, []);


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }
  
    if (!authLoading && user) {
      fetchData();
    }
  }, [user, authLoading, router, fetchData]);

  const previousWeek = getPreviousWeekRange();
  const weekLabel = `${previousWeek.start} - ${previousWeek.end}`;

  const handleInputChange = (path: string, value: string | number) => {
    if (!data) return;

    setData(prevData => {
        if (!prevData) return null;

        const updatedData = JSON.parse(JSON.stringify(prevData));
        const keys = path.split('.');
        let current: any = updatedData;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (current[key] === undefined) {
                 console.warn(`Path does not exist: ${path}`);
                 return prevData;
            }
            current = current[key];
        }
        
        const finalKey = keys[keys.length - 1];
        
        // Handle name change from a Select component
        if (finalKey === 'nombre') {
            current[finalKey] = value;
            return updatedData;
        }

        const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
        current[finalKey] = isNaN(numericValue) ? value : numericValue;
        
        // Auto-calculate section weights for aqneSemanal if a euros value changes
        if (path.startsWith('aqneSemanal.') && finalKey === 'totalEuros') {
            const sections = updatedData.aqneSemanal;
            const totalVentasAqne = (sections.woman.metricasPrincipales.totalEuros || 0) +
                                    (sections.man.metricasPrincipales.totalEuros || 0) +
                                    (sections.nino.metricasPrincipales.totalEuros || 0);

            if (totalVentasAqne > 0) {
                sections.woman.pesoPorc = parseFloat(((sections.woman.metricasPrincipales.totalEuros / totalVentasAqne) * 100).toFixed(2));
                sections.man.pesoPorc = parseFloat(((sections.man.metricasPrincipales.totalEuros / totalVentasAqne) * 100).toFixed(2));
                sections.nino.pesoPorc = parseFloat(((sections.nino.metricasPrincipales.totalEuros / totalVentasAqne) * 100).toFixed(2));
            } else {
                sections.woman.pesoPorc = 0;
                sections.man.pesoPorc = 0;
                sections.nino.pesoPorc = 0;
            }
        }
        
        // Auto-calculate total for ventasDiariasAQNE
        if (keys[0] === 'ventasDiariasAQNE') {
            const index = parseInt(keys[1], 10);
            if (!isNaN(index) && updatedData.ventasDiariasAQNE[index]) {
                const day = updatedData.ventasDiariasAQNE[index];
                day.total = (day.woman || 0) + (day.man || 0) + (day.nino || 0);
            }
        }
        
        return updatedData;
    });
};

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, "informes", data.periodo.toLowerCase().replace(' ', '-'));
      await setDoc(docRef, data, { merge: true });
      toast({
        title: "¡Guardado!",
        description: "Los cambios se han guardado en la base de datos.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving document: ", error);
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    fetchData(); // Re-fetch original data to discard changes
  };

 const handleImageChange = (path: string, dataUrl: string) => {
    setImageLoadingStatus(prev => ({...prev, [path]: true}));

    setData(currentData => {
      if (!currentData) return null;
      
      const newData = JSON.parse(JSON.stringify(currentData));
      
      const keys = path.split('.');
      let current: any = newData;
      for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = dataUrl;
      
      const reportRef = doc(db, "informes", newData.periodo.toLowerCase().replace(' ', '-'));
      
      // Use a promise to ensure save happens after state update logic
      const saveData = async () => {
          try {
              await setDoc(reportRef, newData, { merge: true });
              toast({
                  title: "Imagen guardada",
                  description: "La nueva imagen se ha guardado.",
              });
          } catch (error) {
              console.error("Error updating image in Firestore: ", error);
              toast({
                  variant: "destructive",
                  title: "Error al guardar imagen",
                  description: "No se pudo guardar la imagen. Inténtalo de nuevo.",
              });
          } finally {
              setImageLoadingStatus(prev => ({...prev, [path]: false}));
          }
      };
      
      saveData();

      return newData;
    });
};

  if (authLoading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4">
          {authLoading ? "Verificando sesión..." : "Cargando datos del informe..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center p-4">
        <p className="text-lg font-semibold text-destructive">Error al Cargar Datos</p>
        <p className="text-muted-foreground">{error}</p>
        <p className="text-sm mt-2 text-muted-foreground">Asegúrate de que la base de datos Firestore está creada en tu proyecto y que las reglas de seguridad son correctas.</p>
        <Button onClick={fetchData} className="mt-4">Reintentar</Button>
      </div>
    );
  }

  if (!data) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>No se encontraron datos para la semana.</p>
        <Button onClick={fetchData} className="mt-4">Cargar datos</Button>
      </div>
    );
  }


  return (
    <div className="min-h-screen w-full p-4 sm:p-6 bg-background">
      <header className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <Briefcase className="h-7 w-7" />
          BUSSINES
        </h1>
        <div className="flex items-center gap-4">
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[190px]">
                      {tabLabels[activeTab]}
                      <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
                      {Object.entries(tabLabels).map(([value, label]) => (
                          <DropdownMenuRadioItem key={value} value={value}>
                              {label}
                          </DropdownMenuRadioItem>
                      ))}
                  </DropdownMenuRadioGroup>
              </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-2">
             <Select value="previous-week">
              <SelectTrigger id="semana-select" className="w-[190px]">
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
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>Cancelar</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="icon">
                <Pencil className="h-4 w-4 text-primary" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50">
                <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => {
                  logout();
                }}>
                  <LogOut className="mr-2 h-4 w-4 text-primary" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main>
         <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
          <TabsContent value="datosSemanales" className="mt-0">
            <DatosSemanalesTab 
              ventas={data.ventas}
              rendimientoTienda={data.rendimientoTienda}
              operaciones={data.operaciones}
              perdidas={data.perdidas}
              datosPorSeccion={data.datosPorSeccion}
              isEditing={isEditing} 
              onInputChange={handleInputChange} 
            />
          </TabsContent>
           <TabsContent value="aqneSemanal" className="mt-0">
             <AqneSemanalTab data={data} isEditing={isEditing} onInputChange={handleInputChange} />
          </TabsContent>
           <TabsContent value="acumulado" className="mt-0">
             <AcumuladoTab data={data.acumulado} isEditing={isEditing} onInputChange={handleInputChange} />
          </TabsContent>
           <TabsContent value="man" className="mt-0">
            <VentasManTab 
              data={data}
              isEditing={isEditing} 
              onInputChange={handleInputChange}
              onImageChange={handleImageChange}
              imageLoadingStatus={imageLoadingStatus}
            />
          </TabsContent>
          <TabsContent value="woman" className="mt-0">
            <VentasWomanTab 
              data={data}
              isEditing={isEditing} 
              onInputChange={handleInputChange}
              onImageChange={handleImageChange}
              imageLoadingStatus={imageLoadingStatus}
            />
          </TabsContent>
          <TabsContent value="nino" className="mt-0">
            <VentasNinoTab
              data={data}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onImageChange={handleImageChange}
              imageLoadingStatus={imageLoadingStatus}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
