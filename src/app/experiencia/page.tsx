

"use client"
import React, { useState, useContext, useEffect, useCallback, Suspense } from 'react';
import type { WeeklyData, Empleado, SectionSpecificData, IncorporacionItem } from "@/lib/data";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Calendar as CalendarIcon, Settings, LogOut, Loader2, Briefcase, LayoutDashboard, Pencil, Projector, AlertTriangle, Users, List, UserPlus, ChartLine, SlidersHorizontal, Hanger, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/context/auth-context';
import { getInitialDataForWeek, getInitialLists } from '@/lib/data';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatWeekIdToDateRange, getCurrentWeekId, getWeekIdFromDate, getPreviousWeekId } from '@/lib/format';
import { FocusSemanalTab } from '@/components/dashboard/focus-semanal-tab';
import { EditListDialog } from '@/components/dashboard/edit-list-dialog';
import { PedidosCard } from '@/components/dashboard/pedidos-card';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { EditEmpleadosDialog } from '@/components/dashboard/edit-empleados-dialog';
import { RankingEmpleadosCard } from '@/components/dashboard/ranking-empleados-card';
import { KpiCard, DatoDoble } from '@/components/dashboard/kpi-card';
import { formatNumber, formatPercentage } from '@/lib/format';
import { CajaCard } from '@/components/dashboard/caja-card';
import { EditRatiosDialog } from '@/components/dashboard/operaciones/edit-ratios-dialog';
import { OnboardingTab } from '@/components/dashboard/onboarding-tab';
import { EncuestasQrTab } from '@/components/dashboard/encuestas-qr-tab';


type EditableList = 'compradorMan' | 'zonaComercialMan' | 'agrupacionComercialMan' | 'compradorWoman' | 'zonaComercialWoman' | 'agrupacionComercialWoman' | 'compradorNino' | 'zonaComercialNino' | 'agrupacionComercialNino';

const listLabels: Record<EditableList, string> = {
    compradorMan: 'Comprador MAN',
    zonaComercialMan: 'Zona Comercial MAN',
    agrupacionComercialMan: 'Agrupación Comercial MAN',
    compradorWoman: 'Comprador WOMAN',
    zonaComercialWoman: 'Tipo de Articulo WOMAN',
    agrupacionComercialWoman: 'Agrupación Comercial WOMAN',
    compradorNino: 'Comprador NIÑO',
    zonaComercialNino: 'Zona Comercial NIÑO',
    agrupacionComercialNino: 'Agrupación Comercial NIÑO',
};


const tabConfig: Record<string, { label: string; icon?: React.FC<React.SVGProps<SVGSVGElement>>, text?: string, path?: string }> = {
    datosSemanales: { label: "GENERAL", icon: LayoutDashboard, path: "/dashboard" },
    woman: { label: "WOMAN", path: "/woman", text: "W" },
    man: { label: "MAN", text: "M", path: "/man" },
    nino: { label: "NIÑO", path: "/nino", text: "N" },
    experiencia: { label: "EXPERIENCIA", text: "E", path: "/experiencia" },
    operaciones: { label: "OPERACIONES", text: "O", path: "/operaciones" },
};

function ExperienciaPageComponent() {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
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
  const [isEmpleadosDialogOpen, setEmpleadosDialogOpen] = useState(false);
  const [isRatiosDialogOpen, setRatiosDialogOpen] = useState(false);

  const selectedWeek = searchParams.get('week') || '';
  const activeTab = "experiencia";
  const [activeSubTab, setActiveSubTab] = useState('experiencia');
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  
  const canEdit = user?.email === 'emiliogp@inditex.com';
  const { toast } = useToast();
  
  const updateUrl = useCallback((newWeek: string) => {
      if (!newWeek) return;
      const params = new URLSearchParams(searchParams);
      params.set('week', newWeek);
      router.replace(`/experiencia?${params.toString()}`);
  }, [router, searchParams]);


  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    const newWeekId = getWeekIdFromDate(date);
    updateUrl(newWeekId);
    setCalendarOpen(false);
  };
  
  const handleTabChange = (newTabKey: string) => {
    const config = tabConfig[newTabKey];
    if (config?.path) {
        router.push(`${config.path}?week=${selectedWeek}`);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (!authLoading && user) {
        const currentWeekId = getCurrentWeekId();
        updateUrl(currentWeekId);
    }
  }, [user, authLoading]);


 const fetchData = useCallback(async (weekId: string) => {
    if (!user || !weekId) return;

    setDataLoading(true);
    setError(null);
    try {
        const reportRef = doc(db, "informes", weekId);
        const listsRef = doc(db, "configuracion", "listas");
        let needsSave = false;

        let masterLists: WeeklyData['listas'];
        const defaultLists = getInitialLists();
        let forceListUpdate = false;

        const [reportSnap, listsSnap] = await Promise.all([
            getDoc(reportRef),
            getDoc(listsRef),
        ]);
        
        if (listsSnap.exists()) {
            masterLists = listsSnap.data() as WeeklyData['listas'];
             // Force update the employee list from code to DB
            if (JSON.stringify(masterLists.empleados) !== JSON.stringify(defaultLists.empleados)) {
                masterLists.empleados = defaultLists.empleados;
                forceListUpdate = true;
            }
        } else {
            masterLists = defaultLists;
            forceListUpdate = true;
        }

        if (canEdit && forceListUpdate) {
            await setDoc(listsRef, masterLists);
        }
        
        // --- Get previous week's pending incorporaciones ---
        const previousWeekId = getPreviousWeekId(weekId);
        const prevReportRef = doc(db, "informes", previousWeekId);
        const prevReportSnap = await getDoc(prevReportRef);
        let pendingIncorporaciones: IncorporacionItem[] = [];

        if (prevReportSnap.exists()) {
            const prevData = prevReportSnap.data() as WeeklyData;
            if (prevData.incorporaciones) {
                pendingIncorporaciones = prevData.incorporaciones.filter(
                    inc => !inc.somosZara || !inc.intalent || !inc.diHola
                );
            }
        }
        // ----------------------------------------------------

        let reportData: WeeklyData;
        if (!reportSnap.exists()) {
             if (canEdit) {
                toast({
                    title: "Creando nueva semana",
                    description: `El informe para "${weekId}" no existía y se ha creado uno nuevo.`,
                });
                reportData = getInitialDataForWeek(weekId, masterLists);
                 // No setDoc here yet, we'll do it after adding pending items
            } else {
                throw new Error(`No se encontró ningún informe para la semana "${weekId}".`);
            }
        } else {
            reportData = reportSnap.data() as WeeklyData;
        }

        reportData.listas = masterLists;

        if (typeof reportData.focusSemanal === 'string' || !reportData.focusSemanal) {
            reportData.focusSemanal = {
                man: "",
                woman: "",
                nino: "",
                experiencia: typeof reportData.focusSemanal === 'string' ? reportData.focusSemanal : ""
            };
            needsSave = true;
        }
        
        if (!reportData.incorporaciones) {
            reportData.incorporaciones = [];
            needsSave = true;
        }

        // --- Merge pending incorporaciones ---
        if (pendingIncorporaciones.length > 0) {
            const existingIds = new Set(reportData.incorporaciones.map(inc => inc.id));
            const newIncorporaciones = pendingIncorporaciones.filter(inc => !existingIds.has(inc.id));
            if (newIncorporaciones.length > 0) {
                reportData.incorporaciones = [...reportData.incorporaciones, ...newIncorporaciones];
                needsSave = true;
            }
        }
        // ------------------------------------

        const defaultSectionData: SectionSpecificData = {
            operaciones: { filasCajaPorc: 0, scoPorc: 0, dropOffPorc: 0, ventaIpod: 0, eTicketPorc: 0, repoPorc: 0, frescuraPorc: 0, coberturaPorc: 0, sinUbicacion: 0 },
            perdidas: { gap: { euros: 0, unidades: 0 }, merma: { euros: 0, unidades: 0, porcentaje: 0 } },
            logistica: { entradasSemanales: 0, salidasSemanales: 0, sintSemanales: 0 },
            almacenes: {
              paqueteria: { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 },
              confeccion: { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 },
              calzado: { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 },
              perfumeria: { ocupacionPorc: 0, devolucionUnidades: null, entradas: 0, salidas: 0 }
            }
        };

        if (!reportData.general) {
            reportData.general = JSON.parse(JSON.stringify(defaultSectionData));
            needsSave = true;
        }


        if (!reportData.pedidos) {
            reportData.pedidos = getInitialDataForWeek(weekId, masterLists).pedidos;
            needsSave = true;
        }

        if (!reportData.pedidos.rankingEmpleados || reportData.pedidos.rankingEmpleados.length === 0) {
            reportData.pedidos.rankingEmpleados = Array.from({ length: 10 }, () => ({ id: '', nombre: '', pedidos: 0, unidades: 0, importes: 0 }));
            needsSave = true;
        }

        if (!reportData.encuestasQr) {
            reportData.encuestasQr = getInitialDataForWeek(weekId, masterLists).encuestasQr;
            needsSave = true;
        }


        if (needsSave && canEdit) {
            await setDoc(reportRef, reportData, { merge: true });
        }
        
        setData(reportData);
    } catch(err: any) {
        setError(`Error al cargar el informe: ${err.message}.`);
        setData(null);
    } finally {
        setDataLoading(false);
    }
  }, [user, canEdit, toast]);

  useEffect(() => {
    if (selectedWeek) {
        fetchData(selectedWeek);
    }
  }, [selectedWeek, fetchData]);
  
  useEffect(() => {
      if(saveSuccess) {
          fetchData(selectedWeek);
          setSaveSuccess(false);
      }
  }, [saveSuccess, fetchData, selectedWeek])

  const handleInputChange = (path: string, value: any) => {
    if (!canEdit || !data) return;

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
        
        if (keys[0] === 'focusSemanal') {
            updatedData.focusSemanal.experiencia = value;
        } else if (keys[0] === 'pedidos' && keys[1] === 'rankingEmpleados') {
            const index = parseInt(keys[2], 10);
            const field = keys[3];
            const ranking = updatedData.pedidos.rankingEmpleados;

            if (field === 'id') {
                const selectedEmployee = updatedData.listas.empleados.find((e: Empleado) => e.id === value);
                ranking[index].id = value;
                ranking[index].nombre = selectedEmployee ? selectedEmployee.nombre : '';
            } else {
                const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
                (ranking[index] as any)[field] = isNaN(numericValue) || value === "" ? 0 : numericValue;
            }

        } else if (keys[0] === 'incorporaciones') {
          const index = parseInt(keys[1], 10);
          const field = keys[2];
          const incorporaciones = updatedData.incorporaciones as IncorporacionItem[];

          if (field === 'idEmpleado') {
              const selectedEmployee = updatedData.listas.empleados.find((e: Empleado) => e.id === value);
              incorporaciones[index].idEmpleado = value;
              incorporaciones[index].nombreEmpleado = selectedEmployee ? selectedEmployee.nombre : (incorporaciones[index].nombreEmpleado || '');
          } else {
              (incorporaciones[index] as any)[field] = value;
          }
        }
        
        else {
            const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
            current[finalKey] = isNaN(numericValue) || value === "" ? 0 : numericValue;
        }
        
        return updatedData;
    });
};

const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    const docRef = doc(db, "informes", selectedWeek);
    const listsRef = doc(db, "configuracion", "listas");

    const dataToSave = JSON.parse(JSON.stringify(data));
    let newEmpleados = [...dataToSave.listas.empleados];
    let empleadosUpdated = false;

    // Synchronize new employees from incorporaciones to the main list
    dataToSave.incorporaciones.forEach((inc: IncorporacionItem) => {
        if (inc.idEmpleado && inc.nombreEmpleado && !newEmpleados.some((e: Empleado) => e.id === inc.idEmpleado)) {
            newEmpleados.push({ id: inc.idEmpleado, nombre: inc.nombreEmpleado });
            empleadosUpdated = true;
        }
    });

    if (empleadosUpdated) {
        await updateDoc(listsRef, { empleados: newEmpleados });
    }
    
    // Fill in names for existing IDs
    dataToSave.incorporaciones.forEach((inc: IncorporacionItem) => {
        if (inc.idEmpleado && !inc.nombreEmpleado) {
            const emp = newEmpleados.find((e: Empleado) => e.id === inc.idEmpleado);
            if (emp) {
                inc.nombreEmpleado = emp.nombre;
            }
        }
    });
    
    const {listas, ...reportData} = dataToSave;
    const relevantData = {
        focusSemanal: reportData.focusSemanal,
        rendimientoTienda: reportData.rendimientoTienda,
        general: reportData.general,
        pedidos: reportData.pedidos,
        encuestasQr: reportData.encuestasQr,
        incorporaciones: reportData.incorporaciones,
    };

    setDoc(docRef, relevantData, { merge: true })
        .then(() => {
            toast({
                title: "¡Guardado!",
                description: "Los cambios se han guardado en la base de datos.",
            });
            setIsEditing(false);
            setSaveSuccess(true);
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
  
    const handleSaveRatios = async (newRatios: WeeklyData['listas']['productividadRatio']) => {
        if (!canEdit) return;
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
      if (!canEdit) return;
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


  
  const tabButtons = [
    { value: 'experiencia', label: 'EXPERIENCIA' },
    { value: 'onboarding', label: 'ONBOARDING' },
    { value: 'encuestas', label: 'ENCUESTAS QR' },
    { value: 'focus', label: 'FOCUS' },
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
                 {Object.entries(tabConfig).map(([tabKey, config]) => {
                    const isActive = activeTab === tabKey;
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
                              <DropdownMenuLabel>MAN</DropdownMenuLabel>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorMan', 'Editar Lista: Comprador MAN')}>Comprador</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialMan', 'Editar Lista: Zona Comercial MAN')}>Zona Comercial</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialMan', 'Editar Lista: Agrupación Comercial MAN')}>Agrupación Comercial</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>WOMAN</DropdownMenuLabel>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorWoman', 'Editar Lista: Comprador WOMAN')}>Comprador</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialWoman', 'Editar Lista: Tipo de Articulo WOMAN')}>Tipo de Articulo</DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialWoman', 'Editar Lista: Agrupación Comercial WOMAN')}>Agrupación Comercial</DropdownMenuItem>
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
                <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                    <div className="mb-4 grid w-full grid-cols-2 md:grid-cols-4 gap-2">
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

                    <TabsContent value="experiencia" className="mt-0">
                        <div className="space-y-4">
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <KpiCard title="Rendimiento de Tienda" icon={<ChartLine className="h-5 w-5 text-primary" />} className="md:col-span-1">
                                <DatoDoble 
                                  label="Tráfico" 
                                  value={formatNumber(data.rendimientoTienda?.trafico)} 
                                  variation={data.rendimientoTienda?.varPorcTrafico}
                                  isEditing={isEditing}
                                  valueId="rendimientoTienda.trafico"
                                  variationId="rendimientoTienda.varPorcTrafico"
                                  onInputChange={handleInputChange}
                                />
                                <DatoDoble 
                                  label="Conversión" 
                                  value={formatPercentage(data.rendimientoTienda?.conversion)} 
                                  variation={data.rendimientoTienda?.varPorcConversion}
                                  isEditing={isEditing}
                                  valueId="rendimientoTienda.conversion"
                                  variationId="rendimientoTienda.varPorcConversion"
                                  onInputChange={handleInputChange}
                                />
                              </KpiCard>
                              <CajaCard
                                operaciones={data.general?.operaciones}
                                isEditing={isEditing}
                                onInputChange={handleInputChange}
                                className="md:col-span-2"
                              />
                           </div>
                           {data.pedidos && (
                            <div className="space-y-4">
                                <PedidosCard
                                    data={data.pedidos}
                                    isEditing={isEditing}
                                    onInputChange={handleInputChange}
                                />
                                <RankingEmpleadosCard
                                    ranking={data.pedidos.rankingEmpleados}
                                    empleados={data.listas.empleados}
                                    isEditing={isEditing}
                                    canEdit={canEdit}
                                    onEditEmpleados={() => setEmpleadosDialogOpen(true)}
                                    onInputChange={handleInputChange}
                                />
                            </div>
                           )}
                        </div>
                    </TabsContent>
                    <TabsContent value="onboarding" className="mt-0">
                       <OnboardingTab
                          data={data}
                          isEditing={isEditing}
                          onInputChange={handleInputChange}
                          setData={setData}
                       />
                    </TabsContent>
                    <TabsContent value="encuestas" className="mt-0">
                        <EncuestasQrTab
                            data={data.encuestasQr}
                            isEditing={isEditing}
                            onInputChange={handleInputChange}
                        />
                    </TabsContent>
                    <TabsContent value="focus" className="mt-0">
                       <FocusSemanalTab 
                          text={data.focusSemanal?.experiencia || ""} 
                          isEditing={isEditing} 
                          onTextChange={(val) => handleInputChange('focusSemanal.experiencia', val)} 
                        />
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


      </div>
    </TooltipProvider>
  );
}


export default function ExperienciaPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4">Cargando sección EXPERIENCIA...</p>
            </div>
        }>
            <ExperienciaPageComponent />
        </Suspense>
    );
}
