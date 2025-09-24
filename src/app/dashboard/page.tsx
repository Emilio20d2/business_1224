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
import { VentasManTab } from '@/components/dashboard/ventas-man-tab';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, Loader2, ChevronDown, Pencil, Briefcase, List } from 'lucide-react';
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
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/context/auth-context';
import { getInitialDataForWeek, getInitialLists } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { EditListDialog } from '@/components/dashboard/edit-list-dialog';


type EditableList = 'compradorMan' | 'zonaComercialMan' | 'agrupacionComercialMan';
type TabValue = "datosSemanales" | "aqneSemanal" | "acumulado" | "man";


const tabLabels: Record<string, string> = {
    datosSemanales: "GENERAL",
    aqneSemanal: "AQNE",
    acumulado: "ACUMULADO",
    man: "MAN",
};

const listLabels: Record<EditableList, string> = {
    compradorMan: 'Comprador MAN',
    zonaComercialMan: 'Zona Comercial MAN',
    agrupacionComercialMan: 'Agrupación Comercial MAN',
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
            imageUrl: "",
        };
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
  
  const [activeTab, setActiveTab] = useState<string>("datosSemanales");

  const [isListDialogOpen, setListDialogOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<{ listKey: EditableList, title: string } | null>(null);


  const { toast } = useToast();
  
 const fetchData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    setError(null);
    try {
        const week = "semana-24";
        const reportRef = doc(db, "informes", week);
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
            reportData = getInitialDataForWeek(week, listData);
            await setDoc(reportRef, reportData);
        }

        // 3. ALWAYS ensure the report data uses the LATEST lists
        reportData.listas = listData;

        // 4. Synchronize tables in the report with the latest lists
        let needsSave = false;
        const sections = [
            { ventasKey: 'ventasMan', listKeys: { comprador: 'compradorMan', zonaComercial: 'zonaComercialMan', agrupacionComercial: 'agrupacionComercialMan' } },
        ] as const;

        for (const section of sections) {
            const { ventasKey, listKeys } = section;

            // Ensure the section object exists
            if (!reportData[ventasKey]) {
                reportData[ventasKey] = getInitialDataForWeek('temp', listData)[ventasKey];
                needsSave = true;
            }

            const syncAndCheck = (tableKey: keyof WeeklyData[typeof ventasKey], listKey: keyof typeof listKeys) => {
                const currentList = listData[listKeys[listKey]] || [];
                // Ensure tableData is an array before processing
                const currentTable = Array.isArray(reportData[ventasKey][tableKey]) ? reportData[ventasKey][tableKey] : [];
                const syncedTable = synchronizeTableData(currentList, currentTable);

                if (JSON.stringify(syncedTable) !== JSON.stringify(reportData[ventasKey][tableKey])) {
                    (reportData[ventasKey][tableKey] as any) = syncedTable;
                    needsSave = true;
                }
            };
            
            syncAndCheck('pesoComprador', 'comprador');
            syncAndCheck('zonaComercial', 'zonaComercial');
            syncAndCheck('agrupacionComercial', 'agrupacionComercial');
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
    if (!authLoading && !user) {
      router.push('/');
    } else if (!authLoading && user) {
      fetchData();
    }
  }, [user, authLoading, router, fetchData]);

  const previousWeek = getPreviousWeekRange();
  const weekLabel = `${previousWeek.start} - ${previousWeek.end}`;

  const handleInputChange = (path: string, value: any) => {
    if (!isEditing) return;
    
    setData(prevData => {
        if (!prevData) return null;

        // Create a deep copy to prevent state mutation issues
        const updatedData = JSON.parse(JSON.stringify(prevData));
        
        let current: any = updatedData;
        const keys = path.split('.');
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (current[keys[i]] === undefined) {
                // If a path segment doesn't exist, create it.
                // This is crucial for nested properties.
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        const finalKey = keys[keys.length - 1];
        
        const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
        current[finalKey] = isNaN(numericValue) || value === "" ? value : numericValue;
        
        // --- Recalculation Logic ---
        if (path.startsWith('aqneSemanal.')) {
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
    fetchData(); 
  };
  
  const handleOpenListDialog = (listKey: EditableList, title: string) => {
      setListToEdit({ listKey, title });
      setListDialogOpen(true);
  };
  
 const handleSaveList = async (listKey: EditableList, newItems: string[]) => {
    if (!listKey) return;
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
        await fetchData();

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

const handleImageChange = (path: string, file: File, onUploadComplete: (success: boolean) => void) => {
    if (!data) {
        onUploadComplete(false);
        return;
    }

    const storageRef = ref(storage, `informes/${data.periodo.toLowerCase().replace(' ', '-')}/${file.name}-${Date.now()}`);

    uploadBytes(storageRef, file).then(snapshot => {
        getDownloadURL(snapshot.ref).then(downloadURL => {
            // Use the safe handleInputChange to update the state
            handleInputChange(path, downloadURL);
            onUploadComplete(true);
            toast({
                title: "Imagen cargada",
                description: "La imagen está lista. Haz clic en 'Guardar' para confirmar todos los cambios.",
            });
            // Ensure editing mode is on
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
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
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
  );
}