"use client"
import React, { useState, useContext, useEffect } from 'react';
import type { WeeklyData, VentasManItem } from "@/lib/data";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
import { EditListDialog } from '@/components/dashboard/edit-list-dialog';
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

// Nueva función de sincronización
const synchronizeTableData = (list: string[], oldTableData: any[]) => {
    const oldDataMap = new Map(oldTableData.map((item: any) => [item.nombre, item]));
    return list.map(itemName => {
        const existingItem = oldDataMap.get(itemName);
        if (existingItem) {
            return existingItem;
        } else {
            return {
                nombre: itemName,
                pesoPorc: 0,
                totalEuros: 0,
                varPorc: 0,
                imageUrl: "",
            };
        }
    });
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

  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<EditableList | null>(null);
  
  const [activeTab, setActiveTab] = useState<string>("datosSemanales");


  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }
  
    if (!authLoading && user) {
        const fetchData = async () => {
            setDataLoading(true);
            setError(null);
            try {
                const week = "semana-24";
                const reportRef = doc(db, "informes", week);
                const listsRef = doc(db, "configuracion", "listas");

                const [reportSnap, listsSnap] = await Promise.all([
                    getDoc(reportRef),
                    getDoc(listsRef)
                ]);

                let reportData: WeeklyData;
                let listData: WeeklyData['listas'];

                if (listsSnap.exists()) {
                    listData = listsSnap.data() as WeeklyData['listas'];
                } else {
                    listData = getInitialLists();
                    await setDoc(listsRef, listData);
                }
                
                if (reportSnap.exists()) {
                    reportData = reportSnap.data() as WeeklyData;
                    
                    let hasBeenUpdated = false;
                    const initialWeekData = getInitialDataForWeek(week, listData);
                    
                    if (!reportData.listas) {
                      reportData.listas = listData;
                      hasBeenUpdated = true;
                    }
                     if (!reportData.ventasMan) {
                        reportData.ventasMan = initialWeekData.ventasMan;
                        hasBeenUpdated = true;
                    }
                    if (!reportData.ventasWoman) {
                        reportData.ventasWoman = initialWeekData.ventasWoman;
                        hasBeenUpdated = true;
                    }
                    if (!reportData.ventasNino) {
                        reportData.ventasNino = initialWeekData.ventasNino;
                        hasBeenUpdated = true;
                    }
                    
                    const dataKeyMapping: Record<EditableList, {ventasKey: keyof WeeklyData, tableKey: 'pesoComprador' | 'zonaComercial' | 'agrupacionComercial'}> = {
                        compradorMan: { ventasKey: 'ventasMan', tableKey: 'pesoComprador' },
                        zonaComercialMan: { ventasKey: 'ventasMan', tableKey: 'zonaComercial' },
                        agrupacionComercialMan: { ventasKey: 'ventasMan', tableKey: 'agrupacionComercial' },
                        compradorWoman: { ventasKey: 'ventasWoman', tableKey: 'pesoComprador' },
                        zonaComercialWoman: { ventasKey: 'ventasWoman', tableKey: 'zonaComercial' },
                        agrupacionComercialWoman: { ventasKey: 'ventasWoman', tableKey: 'agrupacionComercial' },
                        compradorNino: { ventasKey: 'ventasNino', tableKey: 'pesoComprador' },
                        zonaComercialNino: { ventasKey: 'ventasNino', tableKey: 'zonaComercial' },
                        agrupacionComercialNino: { ventasKey: 'ventasNino', tableKey: 'agrupacionComercial' },
                    };

                    (Object.keys(dataKeyMapping) as EditableList[]).forEach(key => {
                        const { ventasKey, tableKey } = dataKeyMapping[key];
                        // @ts-ignore
                        const list = listData[key as keyof typeof listData];
                        // @ts-ignore
                        const tableData = reportData[ventasKey]?.[tableKey] || [];
                        
                        if (list && (list.length !== tableData.length || list.some((item: any, i: number) => item !== tableData[i]?.nombre))) {
                             if (!reportData[ventasKey]) {
                                // @ts-ignore
                                reportData[ventasKey] = getInitialDataForWeek(week, listData)[ventasKey];
                             }
                             // @ts-ignore
                             reportData[ventasKey][tableKey] = synchronizeTableData(list, tableData);
                             hasBeenUpdated = true;
                        }
                    });
                    
                    if(hasBeenUpdated) {
                       await setDoc(reportRef, reportData, { merge: true });
                    }
                    reportData.listas = listData;

                } else {
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
        };
      
      fetchData();
    }
  }, [user, authLoading, router]);

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

        const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
        const finalValue = isNaN(numericValue) ? (typeof current[finalKey] === 'number' ? 0 : value) : numericValue;
        current[finalKey] = finalValue;

        // Auto-calculate section weights for datosPorSeccion if a euros value changes
        if (path.startsWith('datosPorSeccion') && finalKey === 'totalEuros') {
            const sections = updatedData.datosPorSeccion;
            const totalGeneral = (sections.woman.metricasPrincipales.totalEuros || 0) +
                                  (sections.man.metricasPrincipales.totalEuros || 0) +
                                  (sections.nino.metricasPrincipales.totalEuros || 0);
            
            if (totalGeneral > 0) {
                sections.woman.pesoPorc = parseFloat(((sections.woman.metricasPrincipales.totalEuros / totalGeneral) * 100).toFixed(2));
                sections.man.pesoPorc = parseFloat(((sections.man.metricasPrincipales.totalEuros / totalGeneral) * 100).toFixed(2));
                sections.nino.pesoPorc = parseFloat(((sections.nino.metricasPrincipales.totalEuros / totalGeneral) * 100).toFixed(2));
            } else {
                sections.woman.pesoPorc = 0;
                sections.man.pesoPorc = 0;
                sections.nino.pesoPorc = 0;
            }
        }
        
        // Auto-calculate section weights for aqneSemanal if a euros value changes
        if (path.startsWith('aqneSemanal') && finalKey === 'totalEuros') {
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

        // Sync comprador with zonaComercial if names match
        const ventasKey = keys[0] as keyof WeeklyData;
        if ((ventasKey === 'ventasMan' || ventasKey === 'ventasWoman' || ventasKey === 'ventasNino') && keys[1] === 'pesoComprador') {
            const compradorIndex = parseInt(keys[2], 10);
            // @ts-ignore
            const compradorItem: VentasManItem = updatedData[ventasKey].pesoComprador[compradorIndex];
            if (compradorItem) {
                // @ts-ignore
                const zonaComercialList: VentasManItem[] = updatedData[ventasKey].zonaComercial;
                const matchingZonaIndex = zonaComercialList.findIndex(item => item.nombre === compradorItem.nombre);

                if (matchingZonaIndex !== -1) {
                    // @ts-ignore
                    updatedData[ventasKey].zonaComercial[matchingZonaIndex] = {
                        ...updatedData[ventasKey].zonaComercial[matchingZonaIndex],
                        pesoPorc: compradorItem.pesoPorc,
                        totalEuros: compradorItem.totalEuros,
                        varPorc: compradorItem.varPorc,
                    };
                }
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
    // TODO: Re-fetch or reset to original data state here to discard changes.
    // For now, it just exits editing mode.
  };

  const handleSaveList = async (newList: string[]) => {
    if (!listToEdit || !data) return;

    try {
        const listsRef = doc(db, "configuracion", "listas");
        await updateDoc(listsRef, { [listToEdit]: newList });

        const updatedData = JSON.parse(JSON.stringify(data));
        updatedData.listas[listToEdit!] = newList;

        const dataKeyMapping: Record<EditableList, {ventasKey: keyof WeeklyData, tableKey: 'pesoComprador' | 'zonaComercial' | 'agrupacionComercial'}> = {
            compradorMan: { ventasKey: 'ventasMan', tableKey: 'pesoComprador' },
            zonaComercialMan: { ventasKey: 'ventasMan', tableKey: 'zonaComercial' },
            agrupacionComercialMan: { ventasKey: 'ventasMan', tableKey: 'agrupacionComercial' },
            compradorWoman: { ventasKey: 'ventasWoman', tableKey: 'pesoComprador' },
            zonaComercialWoman: { ventasKey: 'ventasWoman', tableKey: 'zonaComercial' },
            agrupacionComercialWoman: { ventasKey: 'ventasWoman', tableKey: 'agrupacionComercial' },
            compradorNino: { ventasKey: 'ventasNino', tableKey: 'pesoComprador' },
            zonaComercialNino: { ventasKey: 'ventasNino', tableKey: 'zonaComercial' },
            agrupacionComercialNino: { ventasKey: 'ventasNino', tableKey: 'agrupacionComercial' },
        };
        const { ventasKey, tableKey } = dataKeyMapping[listToEdit!];
        
        // @ts-ignore
        const oldTableData = updatedData[ventasKey]?.[tableKey] || [];
        const newTableData = synchronizeTableData(newList, oldTableData);
        // @ts-ignore
        if (updatedData[ventasKey]) {
          // @ts-ignore
          updatedData[ventasKey][tableKey] = newTableData;
        }

        const reportRef = doc(db, "informes", updatedData.periodo.toLowerCase().replace(' ', '-'));
        await setDoc(reportRef, updatedData, { merge: true });
        
        setData(updatedData);

        toast({
            title: "Lista Actualizada y Sincronizada",
            description: `La lista de ${listToEdit} y el informe se han guardado.`
        });

    } catch (error) {
        console.error("Error saving list:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar la lista",
            description: "No se pudo guardar la lista de configuración.",
        });
    } finally {
        setIsListDialogOpen(false);
        setListToEdit(null);
    }
};

 const handleImageChange = async (path: string, dataUrl: string) => {
    if (!data) return;

    setImageLoadingStatus(prev => ({...prev, [path]: true}));

    const updatedData = await new Promise<WeeklyData | null>(resolve => {
        setData(currentData => {
            if (!currentData) {
                resolve(null);
                return null;
            }
            const newData = JSON.parse(JSON.stringify(currentData));
            const keys = path.split('.');
            let current: any = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = dataUrl;
            resolve(newData);
            return newData;
        });
    });

    if(!updatedData) {
      setImageLoadingStatus(prev => ({...prev, [path]: false}));
      return;
    }

    try {
        const reportRef = doc(db, "informes", updatedData.periodo.toLowerCase().replace(' ', '-'));
        await setDoc(reportRef, updatedData, { merge: true });
        
        toast({
            title: "Imagen guardada",
            description: "La nueva imagen y los datos actuales se han guardado.",
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

  const handleOpenListDialog = (listName: EditableList) => {
      setListToEdit(listName);
      setIsListDialogOpen(true);
  };

  const getTitleForList = (listName: EditableList | null) => {
      if (!listName) return 'Editar Lista';
      if (listName.includes('Man')) return `Editar Lista de ${listName.replace('Man', ' (MAN)')}`;
      if (listName.includes('Woman')) return `Editar Lista de ${listName.replace('Woman', ' (WOMAN)')}`;
      if (listName.includes('Nino')) return `Editar Lista de ${listName.replace('Nino', ' (NIÑO)')}`;
      return 'Editar Lista';
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
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md">Reintentar</button>
      </div>
    );
  }

  if (!data) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4">Cargando datos del informe...</p>
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
                <DropdownMenuLabel className="font-normal text-muted-foreground px-2 py-1.5 text-xs">EDITAR LISTAS MAN</DropdownMenuLabel>
                  <DropdownMenuGroup>
                      <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorMan')}>
                          <span>COMPRADOR</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialMan')}>
                          <span>ZONA COMPRADOR</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialMan')}>
                          <span>AGRUPACIÓN COMERCIAL</span>
                      </DropdownMenuItem>
                  </DropdownMenuGroup>
                 <DropdownMenuSeparator />
                 <DropdownMenuLabel className="font-normal text-muted-foreground px-2 py-1.5 text-xs">EDITAR LISTAS WOMAN</DropdownMenuLabel>
                  <DropdownMenuGroup>
                      <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorWoman')}>
                          <span>COMPRADOR</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialWoman')}>
                          <span>ZONA COMPRADOR</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialWoman')}>
                          <span>AGRUPACIÓN COMERCIAL</span>
                      </DropdownMenuItem>
                  </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="font-normal text-muted-foreground px-2 py-1.5 text-xs">EDITAR LISTAS NIÑO</DropdownMenuLabel>
                  <DropdownMenuGroup>
                      <DropdownMenuItem onSelect={() => handleOpenListDialog('compradorNino')}>
                          <span>COMPRADOR</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercialNino')}>
                          <span>ZONA COMPRADOR</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercialNino')}>
                          <span>AGRUPACIÓN COMERCIAL</span>
                      </DropdownMenuItem>
                  </DropdownMenuGroup>
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

      {listToEdit && data.listas && (
          <EditListDialog
              isOpen={isListDialogOpen}
              onClose={() => setIsListDialogOpen(false)}
              title={getTitleForList(listToEdit)}
              items={data.listas[listToEdit]}
              onSave={handleSaveList}
          />
      )}
    </div>
  );
}
