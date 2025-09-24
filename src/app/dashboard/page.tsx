"use client"
import React, { useState, useContext, useEffect, useCallback } from 'react';
import type { WeeklyData, VentasManItem } from "@/lib/data";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
import { Settings, LogOut, Loader2, ChevronDown, Briefcase, List, LayoutDashboard, ShoppingBag, AreaChart, User as UserIcon, Pencil } from 'lucide-react';
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
import { addWeeks, format, getISOWeek, getISOWeekYear, startOfISOWeek, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/context/auth-context';
import { getInitialDataForWeek, getInitialLists } from '@/lib/data';
import { useRouter, useSearchParams } from 'next/navigation';
import { EditListDialog } from '@/components/dashboard/edit-list-dialog';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VentasManTab } from '@/components/dashboard/ventas-man-tab';


type EditableList = 'compradorMan' | 'zonaComercialMan' | 'agrupacionComercialMan' | 'compradorWoman' | 'zonaComercialWoman' | 'agrupacionComercialWoman' | 'compradorNino' | 'zonaComercialNino' | 'agrupacionComercialNino';
type TabValue = "datosSemanales" | "aqneSemanal" | "acumulado" | "man";
type WeekOption = { value: string; label: string };


const tabConfig: Record<string, { label: string; icon: React.FC<React.SVGProps<SVGSVGElement>>, path?: string }> = {
    datosSemanales: { label: "GENERAL", icon: LayoutDashboard },
    aqneSemanal: { label: "AQNE", icon: ShoppingBag },
    acumulado: { label: "ACUMULADO", icon: AreaChart },
    man: { label: "MAN", icon: UserIcon },
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


const getWeekId = (date: Date): string => {
  const isoWeekYear = getISOWeekYear(date);
  const isoWeek = getISOWeek(date);
  return `semana-${isoWeekYear}-${isoWeek}`;
};

const generateWeeks = (): WeekOption[] => {
    const weeks: WeekOption[] = [];
    const startDate = new Date('2025-09-15T12:00:00Z');
    
    for (let i = 0; i < 104; i++) { // Generate 2 years of weeks
        const date = addWeeks(startDate, i);
        const start = startOfISOWeek(date);
        const weekId = getWeekId(start);
        
        const end = addWeeks(start, 1);
        const endDate = new Date(end.getTime() - 1);

        const label = `${format(start, 'd MMM', { locale: es })} - ${format(endDate, 'd MMM, yyyy', { locale: es })}`;
        
        weeks.push({ value: weekId, label });
    }
    return weeks;
}

const initialWeeks = generateWeeks();
const initialDefaultWeek = initialWeeks.length > 0 ? initialWeeks[0].value : `semana-${getISOWeekYear(new Date())}-${getISOWeek(new Date())}`;


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
            totalEurosSemanaAnterior: 0,
            varPorc: 0,
            imageUrl: "",
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
  
  const selectedWeek = searchParams.get('week') || initialDefaultWeek;
  const activeTab = (searchParams.get('tab') as TabValue) || 'datosSemanales';

  const canEdit = user?.email === 'emiliogp@inditex.com';
  const { toast } = useToast();
  
  const updateUrl = (newWeek: string, newTab: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('week', newWeek);
      params.set('tab', newTab);
      router.replace(`/dashboard?${params.toString()}`);
  }

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


 const fetchData = useCallback(async (weekId: string) => {
    if (!user) return;
    setDataLoading(true);
    setError(null);
    try {
        const reportRef = doc(db, "informes", weekId);
        const listsRef = doc(db, "configuracion", "listas");

        // 1. Fetch lists first, it's the source of truth for structure
        let listData: WeeklyData['listas'];
        const listsSnap = await getDoc(listsRef);
        if (listsSnap.exists() && listsSnap.data()) {
            listData = listsSnap.data() as WeeklyData['listas'];
        } else {
            // If lists don't exist, create them with the full initial data
            listData = getInitialLists();
            await setDoc(listsRef, listData);
        }

        // 2. Fetch the weekly report
        let reportData: WeeklyData;
        const reportSnap = await getDoc(reportRef);

        if (reportSnap.exists()) {
            reportData = reportSnap.data() as WeeklyData;
        } else {
            // If it doesn't exist, create a fresh one from scratch using the lists
            reportData = getInitialDataForWeek(weekId, listData);
            await setDoc(reportRef, reportData);
        }

        // 3. ALWAYS ensure the report data uses the LATEST lists
        reportData.listas = listData;

        // 4. Synchronize tables in the report with the latest lists
        let needsSave = false;
        
        const currentManCompradorNames = reportData.ventasMan?.pesoComprador?.map(i => i.nombre).sort().join(',') || '';
        const listManCompradorNames = (listData.compradorMan || []).sort().join(',');

        if(currentManCompradorNames !== listManCompradorNames) {
            reportData.ventasMan.pesoComprador = synchronizeTableData(listData.compradorMan, reportData.ventasMan.pesoComprador);
            needsSave = true;
        }

        const currentZonaComercialNames = reportData.ventasMan?.zonaComercial?.map(i => i.nombre).sort().join(',') || '';
        const listZonaComercialNames = (listData.zonaComercialMan || []).sort().join(',');

         if(currentZonaComercialNames !== listZonaComercialNames) {
            reportData.ventasMan.zonaComercial = synchronizeTableData(listData.zonaComercialMan, reportData.ventasMan.zonaComercial);
            needsSave = true;
        }
        
        const currentAgrupacionComercialNames = reportData.ventasMan?.agrupacionComercial?.map(i => i.nombre).sort().join(',') || '';
        const listAgrupacionComercialNames = (listData.agrupacionComercialMan || []).sort().join(',');

         if(currentAgrupacionComercialNames !== listAgrupacionComercialNames) {
            reportData.ventasMan.agrupacionComercial = synchronizeTableData(listData.agrupacionComercialMan, reportData.ventasMan.agrupacionComercial);
            needsSave = true;
        }

        if (needsSave) {
            await setDoc(reportRef, reportData, { merge: true });
        }
        
        // 5. Set final, correct data to state
        setData(reportData);

    } catch (err: any) {
        console.error("Error fetching or setting Firestore document:", err);
        setError(`Error al conectar con la base de datos: ${err.message}. Verifica las reglas de seguridad de Firestore y la conexión a internet.`);
        toast({
            variant: "destructive",
            title: "Error de Conexión",
            description: `No se pudo conectar a la base de datos: ${err.message}`,
        });
    } finally {
        setDataLoading(false);
    }
  }, [user, toast]);

    useEffect(() => {
        setWeeks(initialWeeks);
    }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (!authLoading && user) {
      fetchData(selectedWeek);
    }
  }, [user, authLoading, router, fetchData, selectedWeek]);


  const handleInputChange = (path: string, value: any) => {
    if (!canEdit) return;
    
    setData(prevData => {
        if (!prevData) return null;

        // Create a deep copy to prevent state mutation issues
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
        
        // --- Recalculation Logic ---
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
            
            // Recalculate ventas.totalUnidades from datosPorSeccion totals
            const totalUnidades = (man?.metricasPrincipales.totalUnidades || 0) +
                                (woman?.metricasPrincipales.totalUnidades || 0) +
                                (nino?.metricasPrincipales.totalUnidades || 0);
            updatedData.ventas.totalUnidades = totalUnidades;
            
            // Recalculate ventas.totalEuros from datosPorSeccion totals
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
        
        return updatedData;
    });
};

 const handleImageChange = (path: string, file: File, onUploadComplete: (success: boolean, downloadURL?: string) => void) => {
    if (!data || !canEdit) {
        onUploadComplete(false);
        return;
    }

    const storageRef = ref(storage, `informes/${selectedWeek}/${file.name}-${Date.now()}`);

    uploadBytes(storageRef, file).then(snapshot => {
        getDownloadURL(snapshot.ref).then(downloadURL => {
            handleInputChange(path, downloadURL);
            onUploadComplete(true, downloadURL);
            toast({
                title: "Imagen cargada",
                description: "La imagen está lista. Haz clic en 'Guardar' para confirmar todos los cambios.",
            });
            if (!isEditing) {
                setIsEditing(true);
            }
        });
    }).catch(error => {
         console.error("Error uploading image: ", error);
        toast({
            variant: "destructive",
            title: "Error al subir la imagen",
            description: "No se pudo subir la imagen. Comprueba tu conexión y los permisos de Firebase Storage.",
        });
        onUploadComplete(false);
    });
};


  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      const docRef = doc(db, "informes", selectedWeek);
      await setDoc(docRef, data, { merge: true });
      toast({
        title: "¡Guardado!",
        description: "Los cambios se han guardado en la base de datos.",
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error saving document: ", error);
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: `No se pudieron guardar los cambios. ${error.message}`,
      });
    } finally {
      setIsSaving(false);
    }
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
    try {
        const listsRef = doc(db, "configuracion", "listas");
        await updateDoc(listsRef, { [listKey]: newItems });

        toast({
            title: "Lista actualizada",
            description: `La lista "${listLabels[listKey]}" se ha guardado.`,
        });
        
        setListDialogOpen(false);
        setListToEdit(null);
        // Fetch data again to reflect the list changes in the current view immediately
        await fetchData(selectedWeek);

    } catch (error: any) {
        console.error("Error saving list:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar la lista",
            description: `No se pudo guardar la lista. ${error.message}`,
        });
    } finally {
        setIsSaving(false);
    }
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
        <Button onClick={() => fetchData(selectedWeek)} className="mt-4">Reintentar</Button>
      </div>
    );
  }

  if (!data) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>No se encontraron datos para la semana.</p>
        <Button onClick={() => fetchData(selectedWeek)} className="mt-4">Cargar datos</Button>
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
                  <SelectValue placeholder="Seleccionar semana" />
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
        </main>
        
        {listToEdit && data.listas && (
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
        <React.Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4">Cargando dashboard...</p>
            </div>
        }>
            <DashboardPageComponent />
        </React.Suspense>
    );
}
