
"use client"
import React, { useState, useContext, useEffect, useCallback, Suspense } from 'react';
import type { WeeklyData, Empleado } from "@/lib/data";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Calendar as CalendarIcon, Settings, LogOut, Loader2, Briefcase, LayoutDashboard, Pencil, Projector, ChartLine, Receipt, Clock, ScanLine, Inbox, Ticket, Users, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
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
import { KpiCard, DatoDoble, DatoSimple } from '@/components/dashboard/kpi-card';
import { formatNumber } from '@/lib/format';
import { EditListDialog } from '@/components/dashboard/edit-list-dialog';
import { EditEmpleadosDialog } from '@/components/dashboard/edit-empleados-dialog';

type EditableList = 'compradorMan' | 'zonaComercialMan' | 'agrupacionComercialMan' | 'compradorWoman' | 'zonaComercialWoman' | 'agrupacionComercialWoman' | 'compradorNino' | 'zonaComercialNino' | 'agrupacionComercialNino' | 'compradorExperiencia';

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
    compradorExperiencia: 'Comprador EXPERIENCIA',
};


const tabConfig: Record<string, { label: string; icon?: React.FC<React.SVGProps<SVGSVGElement>>, text?: string, path?: string }> = {
    datosSemanales: { label: "GENERAL", icon: LayoutDashboard, path: "/dashboard" },
    woman: { label: "WOMAN", path: "/woman", text: "W" },
    man: { label: "MAN", text: "M", path: "/man" },
    nino: { label: "NIÑO", path: "/nino", text: "N" },
    experiencia: { label: "EXPERIENCIA", text: "E", path: "/experiencia" },
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
  
  const [isListDialogOpen, setListDialogOpen] = useState(false);
  const [isEmpleadosDialogOpen, setEmpleadosDialogOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<{ listKey: EditableList, title: string } | null>(null);

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
    if (!searchParams.has('week') && user) {
        const previousWeekId = getPreviousWeekId(getCurrentWeekId());
        updateUrl(previousWeekId);
    }
  }, [user, searchParams, updateUrl]);


 const fetchData = useCallback(async (weekId: string) => {
    if (!user || !weekId) return;

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
        if (listsSnap.exists()) {
            listData = listsSnap.data() as WeeklyData['listas'];
        } else {
            listData = getInitialLists();
            if (canEdit) {
              await setDoc(listsRef, listData);
            }
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

        if (typeof reportData.experiencia !== 'object' || reportData.experiencia === null) {
            reportData.experiencia = { texto: "", focus: "" };
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
    if (!authLoading && !user) {
      router.push('/');
    } else if (!authLoading && user && selectedWeek) {
      fetchData(selectedWeek);
    } else if (!authLoading && user && !selectedWeek) {
      setDataLoading(false);
        if(canEdit) {
            const newWeekId = getPreviousWeekId(getCurrentWeekId());
            updateUrl(newWeekId);
        } else {
            setError("No hay informes disponibles. Contacta al administrador.");
        }
    }
  }, [user, authLoading, router, fetchData, selectedWeek, canEdit, updateUrl]);


  const handleTextChange = (field: 'texto' | 'focus', newValue: string) => {
    if (!canEdit) return;
    setData(prevData => {
      if (!prevData) return null;
      const updatedExperiencia = { 
        ...(prevData.experiencia || {texto: "", focus: ""}), 
        [field]: newValue 
      };
      return {
        ...prevData,
        experiencia: updatedExperiencia,
      };
    });
  };

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
        
        return updatedData;
    });
};

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    const docRef = doc(db, "informes", selectedWeek);
    
    const dataToSave = {
        experiencia: data.experiencia,
        rendimientoTienda: data.rendimientoTienda,
        general: data.general,
    };

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

 const handleSaveEmpleados = async (newItems: Empleado[]) => {
    if (!canEdit) return;
    setIsSaving(true);
    const listsRef = doc(db, "configuracion", "listas");

    updateDoc(listsRef, { empleados: newItems })
        .then(() => {
            toast({
                title: "Lista de empleados actualizada",
                description: `La lista de empleados se ha guardado.`,
            });
            setEmpleadosDialogOpen(false);
            return fetchData(selectedWeek);
        })
        .catch(async (error: any) => {
            setError(`Error al guardar la lista: ${error.message}`);
        })
        .finally(() => {
            setIsSaving(false);
        });
};
  
  const tabButtons = [
    { value: 'experiencia', label: 'EXPERIENCIA' },
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
                      <DropdownMenuItem onSelect={() => setEmpleadosDialogOpen(true)}>
                        <Users className="mr-2 h-4 w-4 text-primary" />
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
                            <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialWoman', 'Editar Lista: Zona Comercial WOMAN')}>Zona Comercial</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialWoman', 'Editar Lista: Agrupación Comercial WOMAN')}>Agrupación Comercial</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>NIÑO</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorNino', 'Editar Lista: Comprador NIÑO')}>Comprador</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialNino', 'Editar Lista: Zona Comercial NIÑO')}>Zona Comercial</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialNino', 'Editar Lista: Agrupación Comercial NIÑO')}>Agrupación Comercial</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>EXPERIENCIA</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorExperiencia', 'Editar Lista: Comprador EXPERIENCIA')}>Comprador</DropdownMenuItem>
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
        
        <main className="space-y-4">
           {data ? (
                <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                    <div className="mb-4 grid w-full grid-cols-2 gap-2">
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
                            {data.rendimientoTienda && data.general && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <KpiCard title="Rendimiento de Tienda" icon={<ChartLine className="h-5 w-5 text-primary" />} className="md:col-span-1">
                                        <DatoDoble 
                                            label="Tráfico" 
                                            value={formatNumber(data.rendimientoTienda.trafico)} 
                                            variation={data.rendimientoTienda.varPorcTrafico}
                                            isEditing={isEditing}
                                            valueId="rendimientoTienda.trafico"
                                            variationId="rendimientoTienda.varPorcTrafico"
                                            onInputChange={handleInputChange}
                                        />
                                        <DatoDoble 
                                            label="Conversión" 
                                            value={`${data.rendimientoTienda.conversion.toFixed(1)}%`}
                                            variation={data.rendimientoTienda.varPorcConversion}
                                            isEditing={isEditing}
                                            valueId="rendimientoTienda.conversion"
                                            variationId="rendimientoTienda.varPorcConversion"
                                            onInputChange={handleInputChange}
                                        />
                                    </KpiCard>
                                    <KpiCard title="Caja" icon={<Receipt className="h-5 w-5 text-primary" />} className="md:col-span-2">
                                        <div className="grid grid-cols-4 gap-4 h-full">
                                          <DatoSimple 
                                            icon={<Clock className="h-5 w-5 text-primary"/>} 
                                            label="Filas Caja" 
                                            value={data.general.operaciones.filasCajaPorc}
                                            isEditing={isEditing}
                                            align="center" 
                                            unit="%"
                                            valueId="general.operaciones.filasCajaPorc"
                                            onInputChange={handleInputChange}
                                          />
                                          <DatoSimple 
                                            icon={<ScanLine className="h-5 w-5 text-primary"/>} 
                                            label="ACO" 
                                            value={data.general.operaciones.scoPorc}
                                            isEditing={isEditing}
                                            align="center" 
                                            unit="%"
                                            valueId="general.operaciones.scoPorc"
                                            onInputChange={handleInputChange}
                                          />
                                          <DatoSimple 
                                            icon={<Inbox className="h-5 w-5 text-primary"/>} 
                                            label="DropOff" 
                                            value={data.general.operaciones.dropOffPorc} 
                                            isEditing={isEditing}
                                            align="center" 
                                            unit="%"
                                            valueId="general.operaciones.dropOffPorc"
                                            onInputChange={handleInputChange}
                                          />
                                           <DatoSimple 
                                            icon={<Ticket className="h-5 w-5 text-primary" />} 
                                            label="E-Ticket" 
                                            value={data.general.operaciones.eTicketPorc}
                                            isEditing={isEditing}
                                            align="center" 
                                            unit="%"
                                            valueId="general.operaciones.eTicketPorc"
                                            onInputChange={handleInputChange}
                                          />
                                        </div>
                                    </KpiCard>
                                </div>
                            )}
                            <FocusSemanalTab 
                              text={data.experiencia?.texto || ""} 
                              isEditing={isEditing} 
                              onTextChange={(val) => handleTextChange('texto', val)} 
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="focus" className="mt-0">
                       <FocusSemanalTab 
                          text={data.experiencia?.focus || ""} 
                          isEditing={isEditing} 
                          onTextChange={(val) => handleTextChange('focus', val)} 
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

        {data?.listas?.empleados && (
            <EditEmpleadosDialog
                isOpen={isEmpleadosDialogOpen}
                onClose={() => setEmpleadosDialogOpen(false)}
                empleados={data.listas.empleados}
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

    
