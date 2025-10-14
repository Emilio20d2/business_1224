

"use client"
import React, { useState, useContext, useEffect, useCallback, Suspense } from 'react';
import type { WeeklyData, VentasManItem, SectionSpecificData, Empleado } from "@/lib/data";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { Calendar as CalendarIcon, Settings, LogOut, Loader2, Briefcase, List, LayoutDashboard, Pencil, Upload, Projector, Users, UserPlus, SlidersHorizontal, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatosSemanalesTab } from "@/components/dashboard/datos-semanales-tab";
import { AqneSemanalTab } from "@/components/dashboard/aqne-semanal-tab";
import { AcumuladoTab } from "@/components/dashboard/acumulado-tab";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { formatWeekIdToDateRange, getCurrentWeekId, getWeekIdFromDate } from '@/lib/format';
import { EditEmpleadosDialog } from '@/components/dashboard/edit-empleados-dialog';
import { EditRatiosDialog } from '@/components/dashboard/operaciones/edit-ratios-dialog';
import { EditPresentacionDialog } from '@/components/dashboard/edit-presentacion-dialog';

type EditableList = 'compradorMan' | 'zonaComercialMan' | 'agrupacionComercialMan' | 'compradorWoman' | 'zonaComercialWoman' | 'agrupacionComercialWoman' | 'compradorNino' | 'zonaComercialNino' | 'agrupacionComercialNino';

const tabConfig: Record<string, { label: string; icon?: React.FC<React.SVGProps<SVGSVGElement>>, text?: string, path?: string }> = {
    datosSemanales: { label: "GENERAL", icon: LayoutDashboard, path: "/dashboard?tab=ventas" },
    woman: { label: "SEÑORA", path: "/senora", text: "S" },
    man: { label: "CABALLERO", text: "C", path: "/caballero" },
    nino: { label: "NIÑO", path: "/nino", text: "N" },
    experiencia: { label: "EXPERIENCIA", text: "E", path: "/experiencia" },
    operaciones: { label: "OPERACIONES", text: "O", path: "/operaciones" },
};

const listLabels: Record<EditableList, string> = {
    compradorMan: 'Comprador CABALLERO',
    zonaComercialMan: 'Zona Comercial CABALLERO',
    agrupacionComercialMan: 'Agrupación Comercial CABALLERO',
    compradorWoman: 'Comprador SEÑORA',
    zonaComercialWoman: 'Tipo de Articulo SEÑORA',
    agrupacionComercialWoman: 'Agrupación Comercial SEÑORA',
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
            return { ...existingItem };
        }
        return {
            nombre: itemName,
            pesoPorc: 0,
            totalEuros: 0,
            varPorc: 0,
        };
    });
};

const ensureSectionSpecificData = (data: WeeklyData): WeeklyData => {
    const defaultSectionData = getInitialDataForWeek('', getInitialLists()).general; // Get a full default structure
    const sections: (keyof Pick<WeeklyData, 'general' | 'man' | 'woman' | 'nino'>)[] = ['general', 'man', 'woman', 'nino'];

    sections.forEach(sectionKey => {
        if (!data[sectionKey]) {
            data[sectionKey] = JSON.parse(JSON.stringify(defaultSectionData));
        } else {
            if (!data[sectionKey].logistica) data[sectionKey].logistica = JSON.parse(JSON.stringify(defaultSectionData.logistica));
            if (!data[sectionKey].almacenes) {
                data[sectionKey].almacenes = JSON.parse(JSON.stringify(defaultSectionData.almacenes));
            } else {
                if (!data[sectionKey].almacenes.paqueteria) data[sectionKey].almacenes.paqueteria = JSON.parse(JSON.stringify(defaultSectionData.almacenes.paqueteria));
                if (!data[sectionKey].almacenes.confeccion) data[sectionKey].almacenes.confeccion = JSON.parse(JSON.stringify(defaultSectionData.almacenes.confeccion));
                if (!data[sectionKey].almacenes.calzado) data[sectionKey].almacenes.calzado = JSON.parse(JSON.stringify(defaultSectionData.almacenes.calzado));
                if (!data[sectionKey].almacenes.perfumeria) data[sectionKey].almacenes.perfumeria = JSON.parse(JSON.stringify(defaultSectionData.almacenes.perfumeria));
            }
        }
    });

    return data;
}

function DashboardPageComponent() {
  const { user, loading: authLoading, logout, db } = useContext(AuthContext);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<WeeklyData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [isListDialogOpen, setListDialogOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<{ listKey: EditableList, title: string } | null>(null);
  const [isRatiosDialogOpen, setRatiosDialogOpen] = useState(false);
  const [isEmpleadosDialogOpen, setEmpleadosDialogOpen] = useState(false);
  const [isPresentacionDialogOpen, setPresentacionDialogOpen] = useState(false);
  
  const selectedWeek = searchParams.get('week') || '';
  const activeSubTab = searchParams.get('tab') || 'ventas';
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  
  const canEdit = user?.email === 'emiliogp@inditex.com';
  const { toast } = useToast();
  
  const updateUrl = useCallback((newWeek: string, newTab?: string) => {
      if (!newWeek) return;
      const tab = newTab || activeSubTab || 'ventas';
      const params = new URLSearchParams(searchParams.toString());
      params.set('week', newWeek);
      params.set('tab', tab);
      router.replace(`/dashboard?${params.toString()}`);
  },[router, activeSubTab, searchParams]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const newWeekId = getWeekIdFromDate(date);
    updateUrl(newWeekId, activeSubTab);
    setCalendarOpen(false);
  };
  
  const handleTabChange = (newTabKey: string) => {
    const config = tabConfig[newTabKey];
    if (config?.path) {
        const params = new URLSearchParams(searchParams.toString());
        router.push(`${config.path}?${params.toString()}`);
    } else {
        updateUrl(selectedWeek, newTabKey);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (!authLoading && user && !selectedWeek) {
        const currentWeekId = getCurrentWeekId();
        updateUrl(currentWeekId, 'ventas');
    }
  }, [user, authLoading, selectedWeek, updateUrl]);


 const fetchData = useCallback(async (weekId: string) => {
    if (!user || !weekId || !db) return;
    
    setDataLoading(true);
    setError(null);

    try {
        const reportRef = doc(db, "informes", weekId);
        const listsRef = doc(db, "configuracion", "listas");

        const [reportSnap, listsSnap] = await Promise.all([
            getDoc(reportRef),
            getDoc(listsRef),
        ]);

        let listData: WeeklyData['listas'];
        const defaultLists = getInitialLists();
        
        if (listsSnap.exists()) {
            listData = listsSnap.data() as WeeklyData['listas'];
        } else {
            listData = defaultLists;
            if (canEdit) {
              await setDoc(listsRef, listData);
            }
        }
        
        // Force update the employee list from code to DB
        if (canEdit && JSON.stringify(listData.empleados) !== JSON.stringify(defaultLists.empleados)) {
            listData.empleados = defaultLists.empleados;
            await setDoc(listsRef, listData);
        }

        let reportData: WeeklyData;
        if (!reportSnap.exists()) {
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
        
        reportData.listas = listData;
        
        reportData = ensureSectionSpecificData(reportData);


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
  }, [user, canEdit, toast, db]);
  
  useEffect(() => {
    if (selectedWeek && db) {
        fetchData(selectedWeek);
    }
  }, [selectedWeek, fetchData, db]);

  useEffect(() => {
      if(saveSuccess) {
          fetchData(selectedWeek);
          setSaveSuccess(false);
      }
  }, [saveSuccess, fetchData, selectedWeek])


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
        
        const [mainKey] = keys;
        
        if (mainKey === 'datosPorSeccion') {
            const sectionKey = keys[1] as keyof WeeklyData['datosPorSeccion'];
            const sectionData = updatedData.datosPorSeccion[sectionKey];

            if (sectionData && Array.isArray(sectionData.desglose)) {
                sectionData.metricasPrincipales.totalEuros = sectionData.desglose.reduce((sum: number, item: any) => sum + (item.totalEuros || 0), 0);
                // Assume totalUnidades are entered manually, so we don't calculate them
            }
        
            const sections = updatedData.datosPorSeccion;
            const totalEurosMan = sections.man?.metricasPrincipales.totalEuros || 0;
            const totalEurosWoman = sections.woman?.metricasPrincipales.totalEuros || 0;
            const totalEurosNino = sections.nino?.metricasPrincipales.totalEuros || 0;
            const grandTotalEuros = totalEurosMan + totalEurosWoman + totalEurosNino;

            const totalUnidadesMan = sections.man?.metricasPrincipales.totalUnidades || 0;
            const totalUnidadesWoman = sections.woman?.metricasPrincipales.totalUnidades || 0;
            const totalUnidadesNino = sections.nino?.metricasPrincipales.totalUnidades || 0;
            const grandTotalUnidades = totalUnidadesMan + totalUnidadesWoman + totalUnidadesNino;

            updatedData.ventas.totalEuros = grandTotalEuros;
            updatedData.ventas.totalUnidades = grandTotalUnidades;

             if (grandTotalEuros > 0) {
                if (sections.man) sections.man.pesoPorc = Math.round((totalEurosMan / grandTotalEuros) * 100);
                if (sections.woman) sections.woman.pesoPorc = Math.round((totalEurosWoman / grandTotalEuros) * 100);
                if (sections.nino) sections.nino.pesoPorc = Math.round((totalEurosNino / grandTotalEuros) * 100);
            } else {
                if (sections.man) sections.man.pesoPorc = 0;
                if (sections.woman) sections.woman.pesoPorc = 0;
                if (sections.nino) sections.nino.pesoPorc = 0;
            }
        }
        
        if (mainKey === 'aqneSemanal') {
            const sectionKey = keys[1] as keyof WeeklyData['aqneSemanal'];
            const section = updatedData.aqneSemanal[sectionKey];
            if (section && Array.isArray(section.desglose)) {
                section.metricasPrincipales.totalEuros = section.desglose.reduce((sum: number, item: any) => sum + (item.totalEuros || 0), 0);
            }
        
            const sections = updatedData.aqneSemanal;
            const totalVentasAqne = (sections.woman.metricasPrincipales.totalEuros || 0) +
                                    (sections.man.metricasPrincipales.totalEuros || 0) +
                                    (sections.nino.metricasPrincipales.totalEuros || 0);

            if (totalVentasAqne > 0) {
                sections.woman.pesoPorc = Math.round((sections.woman.metricasPrincipales.totalEuros / totalVentasAqne) * 100);
                sections.man.pesoPorc = Math.round((sections.man.metricasPrincipales.totalEuros / totalVentasAqne) * 100);
                sections.nino.pesoPorc = Math.round((sections.nino.metricasPrincipales.totalEuros / totalVentasAqne) * 100);
            } else {
                sections.woman.pesoPorc = 0;
                sections.man.pesoPorc = 0;
                sections.nino.pesoPorc = 0;
            }
        }
        
        if (keys[0] === 'acumulado') {
            const periodoKey = keys[1] as keyof WeeklyData['acumulado'];
            const periodo = updatedData.acumulado[periodoKey];

            if (periodo && Array.isArray(periodo.desglose)) {
                const totalEurosPeriodo = periodo.desglose.reduce((sum, item) => sum + (item.totalEuros || 0), 0);
                periodo.totalEuros = totalEurosPeriodo;

                if (totalEurosPeriodo > 0) {
                    periodo.desglose.forEach(item => {
                        item.pesoPorc = Math.round((item.totalEuros / totalEurosPeriodo) * 100);
                    });
                } else {
                    periodo.desglose.forEach(item => {
                        item.pesoPorc = 0;
                    });
                }
            }
        }
        
        if (keys[0] === 'ventasDiariasAQNE') {
            const ventaIndex = parseInt(keys[1], 10);
            if (!isNaN(ventaIndex) && updatedData.ventasDiariasAQNE[ventaIndex]) {
                const day = updatedData.ventasDiariasAQNE[ventaIndex];
                day.total = (day.woman || 0) + (day.man || 0) + (day.nino || 0);
            }
        }

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
    if (!data || !db) return;
    setIsSaving(true);
    const docRef = doc(db, "informes", selectedWeek);
    const dataToSave = JSON.parse(JSON.stringify(data));
    
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
  
  const handleOpenRatiosDialog = () => {
    if (!canEdit) return;
    setRatiosDialogOpen(true);
  }
  
 const handleSaveList = async (listKey: EditableList, newItems: string[]) => {
    if (!listKey || !canEdit || !db) return;
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

 const handleSaveRatios = async (newRatios: WeeklyData['listas']['productividadRatio']) => {
    if (!canEdit || !db) return;
    setIsSaving(true);
    const listsRef = doc(db, "configuracion", "listas");

    try {
        await updateDoc(listsRef, { productividadRatio: newRatios });
        toast({
            title: "Ratios actualizados",
            description: "Los nuevos ratios de productividad se han guardado.",
        });
        setRatiosDialogOpen(false);
        setSaveSuccess(true); // Trigger re-fetch
    } catch (error: any) {
        setError(`Error al guardar los ratios: ${error.message}`);
    } finally {
        setIsSaving(false);
    }
};

const handleSaveEmpleados = async (newItems: Empleado[]) => {
  if (!canEdit || !db) return;
  setIsSaving(true);
  const listsRef = doc(db, "configuracion", "listas");

  try {
    await updateDoc(listsRef, { empleados: newItems });
    toast({
      title: "Lista de empleados actualizada",
      description: "La lista de empleados se ha guardado correctamente.",
    });
    setEmpleadosDialogOpen(false);
    await fetchData(selectedWeek);
  } catch (error: any) {
    setError(`Error al guardar la lista de empleados: ${error.message}`);
  } finally {
    setIsSaving(false);
  }
};

const handleSavePresentacion = async (newFooter: string) => {
    if (!canEdit || !db) return;
    setIsSaving(true);
    const listsRef = doc(db, "configuracion", "listas");
    try {
        await updateDoc(listsRef, { presentacionFooter: newFooter });
        toast({
            title: "Pie de página actualizado",
            description: "El pie de página de la presentación se ha guardado.",
        });
        setPresentacionDialogOpen(false);
        setSaveSuccess(true);
    } catch (error: any) {
        setError(`Error al guardar el pie de página: ${error.message}`);
    } finally {
        setIsSaving(false);
    }
};

  const tabButtons = [
    { value: 'ventas', label: 'RESUMEN' },
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
        <header className="mb-4 flex flex-wrap items-center justify-between gap-2">
           <div className="flex w-full flex-wrap items-center justify-start gap-x-4 gap-y-2">
             <h1 className="text-2xl sm:text-3xl font-aptos font-light text-foreground flex items-center gap-2">
                <Briefcase className="h-7 w-7" />
                BUSINESS
             </h1>
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
                     <Button onClick={() => router.push(`/presentation?week=${selectedWeek}`)} variant="outline" size="icon" disabled={!data}>
                        <Projector className="h-4 w-4 text-primary" />
                     </Button>
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
                        <DropdownMenuItem onSelect={() => setPresentacionDialogOpen(true)}>
                            <Clapperboard className="mr-2 h-4 w-4 text-primary" />
                            <span>Editar Pie Presentación</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={handleOpenRatiosDialog}>
                            <SlidersHorizontal className="mr-2 h-4 w-4 text-primary" />
                            <span>Editar Ratios Prod.</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setEmpleadosDialogOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4 text-primary" />
                            <span>Editar Empleados</span>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <List className="mr-2 h-4 w-4 text-primary" />
                            <span>Editar Listas</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuLabel>CABALLERO</DropdownMenuLabel>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorMan', 'Editar Lista: Comprador CABALLERO')}>Comprador</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialMan', 'Editar Lista: Zona Comercial CABALLERO')}>Zona Comercial</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialMan', 'Editar Lista: Agrupación Comercial CABALLERO')}>Agrupación Comercial</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>SEÑORA</DropdownMenuLabel>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorWoman', 'Editar Lista: Comprador SEÑORA')}>Comprador</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialWoman', 'Editar Lista: Tipo de Articulo SEÑORA')}>Tipo de Articulo</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialWoman', 'Editar Lista: Agrupación Comercial SEÑORA')}>Agrupación Comercial</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>NIÑO</DropdownMenuLabel>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorNino', 'Editar Lista: Comprador NIÑO')}>Comprador</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialNino', 'Editar Lista: Zona Comercial NIÑO')}>Zona Comercial</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialNino', 'Editar Lista: Agrupación Comercial NIÑO')}>Agrupación Comercial</DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
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
            <Tabs value={activeSubTab} onValueChange={(newTab) => updateUrl(selectedWeek, newTab)} className="w-full">
              <div className="mb-4 grid w-full grid-cols-2 md:grid-cols-3 gap-2">
                {tabButtons.map(tab => (
                    <Button
                        key={tab.value}
                        variant={activeSubTab === tab.value ? 'default' : 'outline'}
                        onClick={() => updateUrl(selectedWeek, tab.value)}
                        className="w-full"
                    >
                        {tab.label}
                    </Button>
                ))}
              </div>
              
              <TabsContent value="ventas" className="mt-0">
                <DatosSemanalesTab 
                  data={data}
                  ventas={data.ventas}
                  rendimientoTienda={data.rendimientoTienda}
                  operaciones={data.general.operaciones}
                  perdidas={data.general.perdidas}
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
        
        {data && data.listas && (
            <EditRatiosDialog
                isOpen={isRatiosDialogOpen}
                onClose={() => setRatiosDialogOpen(false)}
                ratios={data.listas.productividadRatio}
                onSave={handleSaveRatios}
            />
        )}
        {data && data.listas && (
            <EditEmpleadosDialog
                isOpen={isEmpleadosDialogOpen}
                onClose={() => setEmpleadosDialogOpen(false)}
                empleados={data.listas.empleados || []}
                onSave={handleSaveEmpleados}
            />
        )}
        {data && data.listas && (
            <EditPresentacionDialog
                isOpen={isPresentacionDialogOpen}
                onClose={() => setPresentacionDialogOpen(false)}
                footerText={data.listas.presentacionFooter || ''}
                onSave={handleSavePresentacion}
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

