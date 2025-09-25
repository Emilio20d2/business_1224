"use client"
import React, { useState, useContext, useEffect, useCallback, Suspense } from 'react';
import type { WeeklyData, VentasManItem } from "@/lib/data";
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
import { Button } from '@/components/ui/button';
import { Settings, LogOut, Loader2, ChevronDown, Briefcase, List, LayoutDashboard, ShoppingBag, AreaChart, User as UserIcon, Pencil, Download, Plus } from 'lucide-react';
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
import { formatWeekIdToDateRange } from '@/lib/format';


type EditableList = 'compradorMan' | 'zonaComercialMan' | 'agrupacionComercialMan' | 'compradorWoman' | 'zonaComercialWoman' | 'agrupacionComercialWoman' | 'compradorNino' | 'zonaComercialNino' | 'agrupacionComercialNino';
type TabValue = "datosSemanales" | "aqneSemanal" | "acumulado" | "man";
type WeekOption = { value: string; label: string };


const tabConfig: Record<string, { label: string; icon: React.FC<React.SVGProps<SVGSVGElement>>, path?: string }> = {
    datosSemanales: { label: "GENERAL", icon: LayoutDashboard },
    aqneSemanal: { label: "AQNE", icon: ShoppingBag },
    acumulado: { label: "ACUMULADO", icon: AreaChart },
    man: { label: "MAN", icon: UserIcon, path: "/man" },
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
            totalEurosSemanaAnterior: 0,
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

  const [weeks, setWeeks] = useState<WeekOption[]>([]);
  const [weeksLoading, setWeeksLoading] = useState(true);
  
  const selectedWeek = searchParams.get('week') || '';
  const activeTab = (searchParams.get('tab') as TabValue) || 'datosSemanales';

  const canEdit = user?.email === 'emiliogp@inditex.com';
  const { toast } = useToast();
  
  const updateUrl = useCallback((newWeek: string, newTab: string) => {
      if (!newWeek || !newTab) return;
      const params = new URLSearchParams(searchParams);
      params.set('week', newWeek);
      params.set('tab', newTab);
      router.replace(`/dashboard?${params.toString()}`);
  },[router, searchParams]);

  const handleWeekChange = (newWeek: string) => {
      updateUrl(newWeek, activeTab);
  };
  
  const handleTabChange = (newTab: string) => {
    const config = tabConfig[newTab];
    if (config?.path) {
        router.push(`${config.path}?week=${selectedWeek}`);
    } else {
        updateUrl(selectedWeek, newTab);
    }
  };
  
  useEffect(() => {
    async function fetchAvailableWeeks() {
        if (!user) return;
        setWeeksLoading(true);
        try {
            const informesCollection = collection(db, "informes");
            const querySnapshot = await getDocs(informesCollection);
            const weekIds = querySnapshot.docs.map(doc => doc.id);
            
            weekIds.sort((a, b) => b.localeCompare(a));
            
            const weekOptions = weekIds.map(id => ({
                value: id,
                label: formatWeekIdToDateRange(id)
            }));
            
            setWeeks(weekOptions);

            if (!searchParams.has('week') && weekOptions.length > 0) {
                updateUrl(weekOptions[0].value, activeTab);
            }
        } catch (error: any) {
            setError(`Error al cargar las semanas: ${error.message}`);
        } finally {
            setWeeksLoading(false);
        }
    }
    fetchAvailableWeeks();
  }, [user, searchParams, updateUrl, activeTab]);


 const fetchData = useCallback(async (weekId: string) => {
    if (!user || !weekId) return;
    setDataLoading(true);
    setError(null);

    try {
        const reportRef = doc(db, "informes", weekId);
        const listsRef = doc(db, "configuracion", "listas");

        const [reportSnap, listsSnap] = await Promise.all([
            getDoc(reportRef),
            getDoc(listsRef)
        ]);

        if (!reportSnap.exists()) {
            throw new Error(`No se encontró ningún informe para la semana "${weekId}". Por favor, cree el documento en Firebase.`);
        }
        
        let listData: WeeklyData['listas'];
        if (listsSnap.exists()) {
            listData = listsSnap.data() as WeeklyData['listas'];
        } else {
            console.log("No 'listas' document found, creating one.");
            listData = getInitialLists();
            await setDoc(listsRef, listData);
        }
        
        let reportData = reportSnap.data() as WeeklyData;
        
        if (!reportData.imagenesComprador) {
          reportData.imagenesComprador = {};
        }

        reportData.listas = listData;

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

        if (needsSave) {
            await setDoc(reportRef, reportData, { merge: true });
        }
        
        setData(reportData);
    } catch (err: any) {
        setError(`Error al cargar el informe: ${err.message}.`);
        setData(null);
    } finally {
        setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (!authLoading && user && selectedWeek) {
      fetchData(selectedWeek);
    } else if (!authLoading && user && !selectedWeek && !weeksLoading && weeks.length === 0) {
      setDataLoading(false);
      setError("No hay informes disponibles. Cree el primer informe en la base de datos para comenzar.");
    }
  }, [user, authLoading, router, fetchData, selectedWeek, weeks, weeksLoading]);


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
        current[finalKey] = isNaN(numericValue) || value === "" ? value : numericValue;
        
        const [mainKey, sectionKey, subKey, index, field] = keys;
        
         if (mainKey === 'datosPorSeccion' || mainKey === 'aqneSemanal') {
            const section = updatedData[mainKey][sectionKey];

            if (subKey === 'desglose') {
                if (section && Array.isArray(section.desglose)) {
                    const newTotalEuros = section.desglose.reduce((sum: number, item: any) => sum + (item.totalEuros || 0), 0);
                    section.metricasPrincipales.totalEuros = newTotalEuros;
                }
            }
        }
        
        if (mainKey === 'datosPorSeccion') {
            const { man, woman, nino } = updatedData.datosPorSeccion;
            
            const totalUnidades = (man?.metricasPrincipales.totalUnidades || 0) +
                                (woman?.metricasPrincipales.totalUnidades || 0) +
                                (nino?.metricasPrincipales.totalUnidades || 0);
            updatedData.ventas.totalUnidades = totalUnidades;
            
            const totalEuros = (man?.metricasPrincipales.totalEuros || 0) +
                                (woman?.metricasPrincipales.totalEuros || 0) +
                                (nino?.metricasPrincipales.totalEuros || 0);
            updatedData.ventas.totalEuros = totalEuros;
        }

        
        if (mainKey === 'aqneSemanal') {
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
        
        if (keys[0] === 'ventasDiariasAQNE') {
            const ventaIndex = parseInt(keys[1], 10);
            if (!isNaN(ventaIndex) && updatedData.ventasDiariasAQNE[ventaIndex]) {
                const day = updatedData.ventasDiariasAQNE[ventaIndex];
                day.total = (day.woman || 0) + (day.man || 0) + (day.nino || 0);
            }
        }

        if (keys[0] === 'ventasMan') {
            const tableKey = keys[1] as keyof WeeklyData['ventasMan'];
            if (!updatedData.ventasMan[tableKey]) updatedData.ventasMan[tableKey] = [];
            const itemIndex = parseInt(keys[2], 10);
            const fieldKey = keys[3] as keyof VentasManItem;

            if (
                !isNaN(itemIndex) &&
                updatedData.ventasMan &&
                Array.isArray(updatedData.ventasMan[tableKey]) &&
                updatedData.ventasMan[tableKey][itemIndex]
            ) {
                 (updatedData.ventasMan[tableKey] as VentasManItem[])[itemIndex][fieldKey] = value;
            }
        }
        
        return updatedData;
    });
};

 const handleImageChange = (compradorName: string, file: File, onUploadComplete: (success: boolean) => void) => {
    if (!data || !canEdit || !compradorName) {
        onUploadComplete(false);
        return;
    }

    const storageRef = ref(storage, `informes/${selectedWeek}/${file.name}-${Date.now()}`);

    uploadBytes(storageRef, file).then(snapshot => {
        getDownloadURL(snapshot.ref).then(downloadURL => {
            setData(prevData => {
              if (!prevData) return null;
              const updatedData = JSON.parse(JSON.stringify(prevData));
              if (!updatedData.imagenesComprador) {
                updatedData.imagenesComprador = {};
              }
              updatedData.imagenesComprador[compradorName] = downloadURL;
              return updatedData;
            });
            onUploadComplete(true);
            toast({
                title: "Imagen cargada",
                description: "La imagen está lista. Haz clic en 'Guardar' para confirmar todos los cambios.",
            });
            if (!isEditing) {
                setIsEditing(true);
            }
        });
    }).catch(error => {
        setError(`Error al subir imagen: ${error.message}`);
        onUploadComplete(false);
    });
};


  const handleSave = async () => {
    if (!data) return;
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

 const handleExportJson = () => {
    if (!data) {
        toast({
            variant: "destructive",
            title: "Sin datos para exportar",
            description: "No hay datos cargados para la semana seleccionada.",
        });
        return;
    }
    try {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "semana-exportada.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({
            title: "Exportación exitosa",
            description: "Los datos de la semana se han descargado como JSON.",
        });
    } catch (error) {
        console.error("Error exporting JSON:", error);
        toast({
            variant: "destructive",
            title: "Error al exportar",
            description: "No se pudieron exportar los datos.",
        });
    }
};


  if (authLoading || (!selectedWeek && weeksLoading) || (dataLoading && !error)) {
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
  
  if (!selectedWeek && weeks.length === 0 && !weeksLoading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p>No se encontraron informes en la base de datos.</p>
            <p className="text-sm text-muted-foreground">Crea tu primer informe manualmente en Firebase para empezar.</p>
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
              <div className="hidden sm:flex items-center gap-2">
                 {(Object.keys(tabConfig)).map(tabKey => {
                    const config = tabConfig[tabKey];
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
                                <config.icon className={cn("h-4 w-4", !isActive && "text-primary")} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{config.label}</p>
                          </TooltipContent>
                       </Tooltip>
                    );
                })}
              </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-[150px] justify-between sm:hidden">
                        <span>{(tabConfig[activeTab] as {label: string}).label}</span>
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuRadioGroup value={activeTab} onValueChange={(value) => handleTabChange(value)}>
                        {Object.entries(tabConfig).map(([value, { label, icon: Icon }]) => (
                             <DropdownMenuRadioItem key={value} value={value} className="capitalize">
                                <Icon className="mr-2 h-4 w-4" />
                                {label}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2">
              <Select value={selectedWeek} onValueChange={handleWeekChange}>
                <SelectTrigger id="semana-select" className="w-[220px]">
                   <SelectValue placeholder={weeksLoading ? "Cargando..." : "Seleccionar semana"} />
                </SelectTrigger>
                <SelectContent>
                  {weeks.map(week => (
                      <SelectItem key={week.value} value={week.value}>{week.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  )}
                   <DropdownMenuItem onSelect={handleExportJson}>
                        <Download className="mr-2 h-4 w-4 text-primary" />
                        <span>Exportar JSON</span>
                   </DropdownMenuItem>
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
            <Tabs value={activeTab} onValueChange={(value) => updateUrl(selectedWeek, value)} className="w-full">
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

    