
"use client"
import React, { useState, useContext, useEffect, useCallback, Suspense } from 'react';
import type { WeeklyData, VentasManItem } from "@/lib/data";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Calendar as CalendarIcon, Settings, LogOut, Loader2, ChevronDown, Briefcase, List, LayoutDashboard, ShoppingBag, AreaChart, User as UserIcon, Pencil, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatosSemanalesTab } from "@/components/dashboard/datos-semanales-tab";
import { AqneSemanalTab } from "@/components/dashboard/aqne-semanal-tab";
import { AcumuladoTab } from "@/components/dashboard/acumulado-tab";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/context/auth-context';
import { getInitialDataForWeek, getInitialLists } from '@/lib/data';
import { useRouter, useSearchParams } from 'next/navigation';
import { EditListDialog } from '@/components/dashboard/edit-list-dialog';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VentasManTab } from '@/components/dashboard/ventas-man-tab';
import { formatWeekIdToDateRange, getCurrentWeekId, getWeekIdFromDate, getPreviousWeekId } from '@/lib/format';
import { format, parse, startOfISOWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import semanaExportada from '@/../semana-exportada.json';
import { VentasWomanTab } from '@/components/dashboard/ventas-woman-tab';
import { VentasNinoTab } from '@/components/dashboard/ventas-nino-tab';
import { OperacionesSubTab } from '@/components/dashboard/operaciones-sub-tab';
import { FocusSemanalTab } from '@/components/dashboard/focus-semanal-tab';


type EditableList = 'compradorMan' | 'zonaComercialMan' | 'agrupacionComercialMan' | 'compradorWoman' | 'zonaComercialWoman' | 'agrupacionComercialWoman' | 'compradorNino' | 'zonaComercialNino' | 'agrupacionComercialNino';
type TabValue = "datosSemanales" | "aqneSemanal" | "acumulado" | "man" | "woman" | "nino" | 'ventas' | 'operaciones' | 'focus';


const tabConfig: Record<string, { label: string; icon?: React.FC<React.SVGProps<SVGSVGElement>>, text?: string, path?: string }> = {
    datosSemanales: { label: "GENERAL", icon: LayoutDashboard, path: "/dashboard?tab=datosSemanales" },
    woman: { label: "WOMAN", path: "/woman", text: "W" },
    man: { label: "MAN", text: "M", path: "/man" },
    nino: { label: "NIÑO", path: "/nino", text: "N" },
};

const listLabels: Record<EditableList, string> = {
    compradorMan: 'Comprador MAN',
    zonaComercialMan: 'Zona Comercial MAN',
    agrupacionComercialMan: 'Agrupación Comercial MAN',
    compradorWoman: 'Comprador WOMAN',
    zonaComercialWoman: 'Zona Comercial WOMAN',
    agrupacionComercialWoman: 'Agrupación Comercial WOMAN',
    compradorNino: 'Comprador NIÑO',
    zonaComercialNino: 'Zona Comercial NIÑO',
    agrupacionComercialNino: 'Agrupación Comercial NIÑO',
};

const synchronizeTableData = (list: string[], oldTableData: VentasManItem[]): VentasManItem[] => {
    const safeList = Array.isArray(list) ? list : [];
    const safeOldTableData = Array.isArray(oldTableData) ? oldTableData : [];
    
    const oldDataMap = new Map(safeOldTableData.map(item => [item.nombre, item]));
    
    return safeList.map(itemName => {
        const existingItem = oldDataMap.get(itemName);
        if (existingItem) {
            return { ...existingItem, imageUrl: existingItem.imageUrl || "" };
        }
        return {
            nombre: itemName,
            pesoPorc: 0,
            totalEuros: 0,
            varPorc: 0,
        };
    });
};

function DashboardPageComponent() {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<WeeklyData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isListDialogOpen, setListDialogOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<{ listKey: EditableList, title: string } | null>(null);
  
  const selectedWeek = searchParams.get('week') || '';
  const [activeSubTab, setActiveSubTab] = useState<string>('ventas');
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [importCompleted, setImportCompleted] = useState(false);

  const canEdit = user?.email === 'emiliogp@inditex.com';
  const { toast } = useToast();
  
  const updateUrl = useCallback((newWeek: string, newTab: string) => {
      if (!newWeek || !newTab) return;
      const params = new URLSearchParams(searchParams);
      params.set('week', newWeek);
      params.set('tab', newTab);
      router.replace(`/dashboard?${params.toString()}`);
  },[router, searchParams]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const newWeekId = getWeekIdFromDate(date);
    updateUrl(newWeekId, 'ventas');
    setCalendarOpen(false);
  };
  
  const handleTabChange = (newTab: string) => {
    const config = tabConfig[newTab];
    if (config?.path) {
        if(config.path.startsWith('/dashboard')) {
             router.push(`${config.path}&week=${selectedWeek}`);
        } else {
            router.push(`${config.path}?week=${selectedWeek}`);
        }
    }
  };
  
  useEffect(() => {
    if (!searchParams.has('week') && user) {
        const previousWeekId = getPreviousWeekId(getCurrentWeekId());
        updateUrl(previousWeekId, 'ventas');
    }
  }, [user, searchParams, updateUrl]);


 const fetchData = useCallback(async (weekId: string) => {
    if (!user || !weekId) return;
    
    setDataLoading(true);
    setError(null);

    try {
        const reportRef = doc(db, "informes", weekId);
        const listsRef = doc(db, "configuracion", "listas");
        const importStatusRef = doc(db, "configuracion", "importStatus");

        const [reportSnap, listsSnap, importStatusSnap] = await Promise.all([
            getDoc(reportRef),
            getDoc(listsRef),
            getDoc(importStatusRef)
        ]);

        if (importStatusSnap.exists()) {
            setImportCompleted(importStatusSnap.data().semana39Imported === true);
        } else {
            setImportCompleted(false);
        }

        let listData: WeeklyData['listas'];
        if (listsSnap.exists()) {
            listData = listsSnap.data() as WeeklyData['listas'];
        } else {
            listData = getInitialLists();
            if(canEdit) {
                await setDoc(listsRef, listData);
            }
        }

        let reportData: WeeklyData;
        if (weekId === '2025-39' && !reportSnap.exists()) {
            reportData = JSON.parse(JSON.stringify(semanaExportada)) as WeeklyData;
        } else if (!reportSnap.exists()) {
             if (canEdit) {
                toast({
                    title: "Creando nueva semana",
                    description: `El informe para "${weekId}" no existía y se ha creado uno nuevo.`,
                });
                reportData = getInitialDataForWeek(weekId, listData);
                await setDoc(reportRef, reportData);
            } else {
                throw new Error(`No se encontró ningún informe para la semana "${weekId}".`);
            }
        } else {
            reportData = reportSnap.data() as WeeklyData;
        }
        
        if (!reportData.imagenesComprador) {
          reportData.imagenesComprador = {};
        }

        reportData.listas = listData;

        // Ensure main sales sections exist before synchronization
        if (!reportData.ventasMan) reportData.ventasMan = { pesoComprador: [], zonaComercial: [], agrupacionComercial: [] };
        if (!reportData.ventasWoman) reportData.ventasWoman = { pesoComprador: [], zonaComercial: [], agrupacionComercial: [] };
        if (!reportData.ventasNino) reportData.ventasNino = { pesoComprador: [], zonaComercial: [], agrupacionComercial: [] };


        let needsSave = false;
        
        const syncAndCheck = (reportTable: VentasManItem[] | undefined, list: string[] | undefined): [VentasManItem[], boolean] => {
            const currentNames = reportTable?.map(i => i.nombre).sort().join(',') || '';
            const listNames = (list || []).sort().join(',');
            if (currentNames !== listNames) {
                return [synchronizeTableData(list || [], reportTable || []), true];
            }
            return [reportTable || [], false];
        };

        let changed;
        [reportData.ventasMan.pesoComprador, changed] = syncAndCheck(reportData.ventasMan.pesoComprador, listData.compradorMan);
        if (changed) needsSave = true;
        
        [reportData.ventasMan.zonaComercial, changed] = syncAndCheck(reportData.ventasMan.zonaComercial, listData.zonaComercialMan);
        if (changed) needsSave = true;
        
        [reportData.ventasMan.agrupacionComercial, changed] = syncAndCheck(reportData.ventasMan.agrupacionComercial, listData.agrupacionComercialMan);
        if (changed) needsSave = true;
        
        [reportData.ventasWoman.pesoComprador, changed] = syncAndCheck(reportData.ventasWoman.pesoComprador, listData.compradorWoman);
        if (changed) needsSave = true;
        
        [reportData.ventasWoman.zonaComercial, changed] = syncAndCheck(reportData.ventasWoman.zonaComercial, listData.zonaComercialWoman);
        if (changed) needsSave = true;
        
        [reportData.ventasWoman.agrupacionComercial, changed] = syncAndCheck(reportData.ventasWoman.agrupacionComercial, listData.agrupacionComercialWoman);
        if (changed) needsSave = true;

        [reportData.ventasNino.pesoComprador, changed] = syncAndCheck(reportData.ventasNino.pesoComprador, listData.compradorNino);
        if (changed) needsSave = true;

        [reportData.ventasNino.zonaComercial, changed] = syncAndCheck(reportData.ventasNino.zonaComercial, listData.zonaComercialNino);
        if (changed) needsSave = true;

        [reportData.ventasNino.agrupacionComercial, changed] = syncAndCheck(reportData.ventasNino.agrupacionComercial, listData.agrupacionComercialNino);
        if (changed) needsSave = true;

        if (needsSave && canEdit) {
            await setDoc(reportRef, reportData, { merge: true });
        }
        
        setData(reportData);
    } catch (err: any) {
        setError(`Error al cargar el informe: ${err.message}.`);
        setData(null);
    } finally {
        setDataLoading(false);
    }
  }, [user, canEdit, toast]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (!authLoading && user && selectedWeek) {
      fetchData(selectedWeek);
    } else if (!authLoading && user && !selectedWeek) {
       setDataLoading(false);
        if(canEdit) {
            const newWeekId = getPreviousWeekId(getCurrentWeekId());
            updateUrl(newWeekId, 'ventas');
        } else {
            setError("No hay informes disponibles. Contacta al administrador.");
        }
    }
  }, [user, authLoading, router, fetchData, selectedWeek, canEdit, updateUrl]);


  const handleInputChange = (path: string, value: any) => {
    if (!canEdit) return;
    
    setData(prevData => {
        if (!prevData) return null;

        const updatedData = JSON.parse(JSON.stringify(prevData));
        
        let current: any = updatedData;
        const keys = path.split('.');
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (current[keys[i]] === undefined) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        const finalKey = keys[keys.length - 1];
        
        const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
        
        current[finalKey] = isNaN(numericValue) || value === "" ? 0 : numericValue;
        
        // --- Automatic Calculations ---
        
        const [mainKey, sectionKey, subKey] = keys;

        // 1. Recalculate section totals if a breakdown value changes
        if (mainKey === 'datosPorSeccion' && subKey === 'desglose') {
            const section = updatedData.datosPorSeccion[sectionKey];
            if (section && Array.isArray(section.desglose)) {
                const newTotalEuros = section.desglose.reduce((sum: number, item: any) => sum + (item.totalEuros || 0), 0);
                section.metricasPrincipales.totalEuros = newTotalEuros;
            }
        }
        
        // 2. Recalculate section weights and main sales card totals
        if (mainKey === 'datosPorSeccion') {
            const { man, woman, nino } = updatedData.datosPorSeccion;
            
            const totalEurosMan = man?.metricasPrincipales.totalEuros || 0;
            const totalEurosWoman = woman?.metricasPrincipales.totalEuros || 0;
            const totalEurosNino = nino?.metricasPrincipales.totalEuros || 0;
            const grandTotalEuros = totalEurosMan + totalEurosWoman + totalEurosNino;

            // Update main sales card totals
            updatedData.ventas.totalEuros = grandTotalEuros;

            const totalUnidadesMan = man?.metricasPrincipales.totalUnidades || 0;
            const totalUnidadesWoman = woman?.metricasPrincipales.totalUnidades || 0;
            const totalUnidadesNino = nino?.metricasPrincipales.totalUnidades || 0;
            updatedData.ventas.totalUnidades = totalUnidadesMan + totalUnidadesWoman + totalUnidadesNino;

            // Update section weights
            if (grandTotalEuros > 0) {
                if (man) man.pesoPorc = (totalEurosMan / grandTotalEuros) * 100;
                if (woman) woman.pesoPorc = (totalEurosWoman / grandTotalEuros) * 100;
                if (nino) nino.pesoPorc = (totalEurosNino / grandTotalEuros) * 100;
            } else {
                if (man) man.pesoPorc = 0;
                if (woman) woman.pesoPorc = 0;
                if (nino) nino.pesoPorc = 0;
            }
        }

        // 3. Recalculate AQNE weights and daily totals
        if (mainKey === 'aqneSemanal') {
            const sections = updatedData.aqneSemanal;
             if (subKey === 'desglose') {
                const section = sections[sectionKey];
                if (section && Array.isArray(section.desglose)) {
                    const newTotalEuros = section.desglose.reduce((sum: number, item: any) => sum + (item.totalEuros || 0), 0);
                    section.metricasPrincipales.totalEuros = newTotalEuros;
                }
            }

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
        
        if (keys[0] === 'ventasDiariasAQNE') {
            const ventaIndex = parseInt(keys[1], 10);
            if (!isNaN(ventaIndex) && updatedData.ventasDiariasAQNE[ventaIndex]) {
                const day = updatedData.ventasDiariasAQNE[ventaIndex];
                day.total = (day.woman || 0) + (day.man || 0) + (day.nino || 0);
            }
        }

        // 4. Handle direct input in specific sales tables (man, woman, nino)
        if (keys[0] === 'ventasMan' || keys[0] === 'ventasWoman' || keys[0] === 'ventasNino') {
            const section = keys[0] as 'ventasMan' | 'ventasWoman' | 'ventasNino';
            const tableKey = keys[1] as keyof WeeklyData[typeof section];
            if (!updatedData[section][tableKey]) (updatedData[section] as any)[tableKey] = [];
            const itemIndex = parseInt(keys[2], 10);
            const fieldKey = keys[3] as keyof VentasManItem;

            if (
                !isNaN(itemIndex) &&
                updatedData[section] &&
                Array.isArray((updatedData[section] as any)[tableKey]) &&
                (updatedData[section] as any)[tableKey][itemIndex]
            ) {
                 ((updatedData[section] as any)[tableKey] as VentasManItem[])[itemIndex][fieldKey] = value;
            }
        }
        
        return updatedData;
    });
};



  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    const docRef = doc(db, "informes", selectedWeek);
    const dataToSave = JSON.parse(JSON.stringify(data));
    
    delete dataToSave.imagenesComprador;

    setDoc(docRef, dataToSave, { merge: true })
        .then(() => {
            toast({
                title: "¡Guardado!",
                description: "Los cambios se han guardado en la base de datos.",
            });
            setIsEditing(false);
            fetchData(selectedWeek);
        })
        .catch(async (error: any) => {
             setError(`Error al guardar: ${error.message}`);
        })
        .finally(() => {
            setIsSaving(false);
        });
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    fetchData(selectedWeek); 
  };
  
  const handleOpenListDialog = (listKey: EditableList, title: string) => {
      if(!canEdit) return;
      setListToEdit({ listKey, title });
      setListDialogOpen(true);
  };
  
 const handleSaveList = async (listKey: EditableList, newItems: string[]) => {
    if (!listKey || !canEdit) return;
    setIsSaving(true);
    const listsRef = doc(db, "configuracion", "listas");

    updateDoc(listsRef, { [listKey]: newItems })
        .then(() => {
            toast({
                title: "Lista actualizada",
                description: `La lista "${listLabels[listKey]}" se ha guardado.`,
            });
            setListDialogOpen(false);
            setListToEdit(null);
            return fetchData(selectedWeek);
        })
        .catch(async (error: any) => {
            setError(`Error al guardar la lista: ${error.message}`);
        })
        .finally(() => {
            setIsSaving(false);
        });
};

const handleImportSpecificWeek = async () => {
    if (!canEdit) return;
    const weekIdToImport = '2025-39';
    
    setIsSaving(true);
    toast({ title: "Importando datos...", description: `Guardando datos para la semana ${weekIdToImport}.` });

    const docRef = doc(db, "informes", weekIdToImport);
    const importStatusRef = doc(db, "configuracion", "importStatus");
    const dataToImport = semanaExportada as WeeklyData;
    
    try {
        await setDoc(docRef, dataToImport, { merge: true });
        await setDoc(importStatusRef, { semana39Imported: true }, { merge: true });
        
        toast({
            title: "¡Importación completada!",
            description: `Los datos para la semana ${weekIdToImport} se han guardado en la base de datos.`,
        });
        
        setImportCompleted(true);
        if (selectedWeek === weekIdToImport) {
            fetchData(weekIdToImport);
        }
    } catch (error: any) {
         setError(`Error al importar: ${error.message}`);
         toast({ variant: "destructive", title: "Error al importar", description: "No se pudieron guardar los datos." });
    } finally {
        setIsSaving(false);
    }
};

  const tabButtons = [
    { value: 'ventas', label: 'VENTAS' },
    { value: 'aqne', label: 'AQNE' },
    { value: 'acumulado', label: 'ACUMULADO' },
  ];


  if (authLoading || (dataLoading && !error)) {
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
        <Button onClick={() => fetchData(selectedWeek)} className="mt-4" disabled={!selectedWeek}>Reintentar Carga</Button>
      </div>
    );
  }
  
  if (!user) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p>Redirigiendo a la página de inicio de sesión...</p>
        </div>
     );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen w-full p-2 sm:p-3 bg-background">
        <header className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-7 w-7" />
            BUSSINES
          </h1>
          <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                 {Object.keys(tabConfig).map(tabKey => {
                    const config = tabConfig[tabKey];
                    const isActive = tabKey === 'datosSemanales';
                    return (
                       <Tooltip key={tabKey}>
                          <TooltipTrigger asChild>
                            <Button
                                variant={isActive ? "default" : "outline"}
                                size="icon"
                                onClick={() => handleTabChange(tabKey)}
                                aria-label={config.label}
                            >
                              {config.icon && <config.icon className={cn("h-4 w-4", !isActive && "text-primary")} />}
                              {config.text && <span className={cn("font-bold text-lg", isActive ? "" : "text-primary")}>{config.text}</span>}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{config.label}</p>
                          </TooltipContent>
                       </Tooltip>
                    );
                })}
              </div>

            <div className="flex items-center gap-2">
                <Popover open={isCalendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-auto justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>Semana: </span>
                            {selectedWeek ? (
                                <span className="ml-1 font-semibold">{formatWeekIdToDateRange(selectedWeek)}</span>
                            ) : (
                                <span>Selecciona</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            initialFocus
                            weekStartsOn={1}
                            showOutsideDays
                        />
                    </PopoverContent>
                </Popover>
            </div>
             <div className="flex items-center gap-2">
              {canEdit && (
                <>
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} disabled={isSaving || !data}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar
                      </Button>
                      <Button variant="outline" onClick={handleCancel} disabled={isSaving || !data}>Cancelar</Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="icon" disabled={!data}>
                      <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                  )}
                </>
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
                  {canEdit && (
                    <>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <List className="mr-2 h-4 w-4 text-primary" />
                        <span>Editar Listas</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuLabel>MAN</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorMan', 'Editar Lista: Comprador MAN')}>Comprador</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialMan', 'Editar Lista: Zona Comercial MAN')}>Zona Comercial</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialMan', 'Editar Lista: Agrupación Comercial MAN')}>Agrupación Comercial</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>WOMAN</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorWoman', 'Editar Lista: Comprador WOMAN')}>Comprador</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialWoman', 'Editar Lista: Zona Comercial WOMAN')}>Zona Comercial</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialWoman', 'Editar Lista: Agrupación Comercial WOMAN')}>Agrupación Comercial</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>NIÑO</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorNino', 'Editar Lista: Comprador NIÑO')}>Comprador</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialNino', 'Editar Lista: Zona Comercial NIÑO')}>Zona Comercial</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialNino', 'Editar Lista: Agrupación Comercial NIÑO')}>Agrupación Comercial</DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                    {canEdit && !importCompleted && (
                        <DropdownMenuItem onSelect={handleImportSpecificWeek}>
                            <Upload className="mr-2 h-4 w-4 text-primary" />
                            <span>Importar Semana 39</span>
                        </DropdownMenuItem>
                    )}
                    </>
                  )}
                  {canEdit && <DropdownMenuSeparator />}
                  <DropdownMenuItem onSelect={() => {
                    logout();
                    router.push('/');
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
          {data ? (
            <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
              <div className="mb-4 grid w-full grid-cols-2 md:grid-cols-3 gap-2">
                {tabButtons.map(tab => (
                    <Button
                        key={tab.value}
                        variant={activeSubTab === tab.value ? 'default' : 'outline'}
                        onClick={() => setActiveSubTab(tab.value)}
                        className="w-full"
                    >
                        {tab.label}
                    </Button>
                ))}
              </div>
              
              <TabsContent value="ventas" className="mt-0">
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
              <TabsContent value="aqne" className="mt-0">
                <AqneSemanalTab data={data} isEditing={isEditing} onInputChange={handleInputChange} />
              </TabsContent>
              <TabsContent value="acumulado" className="mt-0">
                <AcumuladoTab data={data.acumulado} isEditing={isEditing} onInputChange={handleInputChange}/>
              </TabsContent>

            </Tabs>
          ) : (
             <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p>Selecciona una semana para ver los datos.</p>
            </div>
          )}
        </main>
        
        {listToEdit && data?.listas && (
          <EditListDialog
            isOpen={isListDialogOpen}
            onClose={() => {
              setListDialogOpen(false);
              setListToEdit(null);
            }}
            title={listToEdit.title}
            items={data.listas[listToEdit.listKey] || []}
            onSave={(newItems) => {
              if (listToEdit) {
                handleSaveList(listToEdit.listKey, newItems);
              }
            }}
          />
        )}
      </div>
    </TooltipProvider>
  );
}


export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4">Cargando dashboard...</p>
            </div>
        }>
            <DashboardPageComponent />
        </Suspense>
    );
}



    