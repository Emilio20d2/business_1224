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
import { VentasWomanTab } from '@/components/dashboard/ventas-woman-tab';
import { VentasNinoTab } from '@/components/dashboard/ventas-nino-tab';
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

// Helper function to safely synchronize a table with a list
const synchronizeTableData = (list: string[] = [], oldTableData: VentasManItem[] = []): VentasManItem[] => {
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
  const [listToEdit, setListToEdit] = useState<EditableList | null>(null);
  const [listTitle, setListTitle] = useState('');


  const { toast } = useToast();
  
  const fetchData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    setError(null);
    try {
        const week = "semana-24"; // Hardcoded for now
        const reportRef = doc(db, "informes", week);
        const listsRef = doc(db, "configuracion", "listas");

        // Step 1: Fetch or create the configuration lists
        let listData: WeeklyData['listas'];
        const listsSnap = await getDoc(listsRef);
        if (listsSnap.exists()) {
            listData = listsSnap.data() as WeeklyData['listas'];
        } else {
            listData = getInitialLists();
            await setDoc(listsRef, listData);
        }

        // Step 2: Fetch or create the weekly report
        const reportSnap = await getDoc(reportRef);
        let reportData: WeeklyData;
        
        if (reportSnap.exists()) {
            reportData = reportSnap.data() as WeeklyData;
            
            // Step 3: Synchronize the report data with the latest lists
            let needsSave = false;
            const sections = [
              { ventasKey: 'ventasMan', listKeys: { comprador: 'compradorMan', zonaComercial: 'zonaComercialMan', agrupacionComercial: 'agrupacionComercialMan' } },
              { ventasKey: 'ventasWoman', listKeys: { comprador: 'compradorWoman', zonaComercial: 'zonaComercialWoman', agrupacionComercial: 'agrupacionComercialWoman' } },
              { ventasKey: 'ventasNino', listKeys: { comprador: 'compradorNino', zonaComercial: 'zonaComercialNino', agrupacionComercial: 'agrupacionComercialNino' } },
            ] as const;

            for (const section of sections) {
                const { ventasKey, listKeys } = section;

                // Ensure the main sales section exists
                if (!reportData[ventasKey]) {
                    reportData[ventasKey] = getInitialDataForWeek('temp', listData)[ventasKey];
                    needsSave = true;
                }

                // Sync comprador
                const compradorList = listData[listKeys.comprador] || [];
                const syncedComprador = synchronizeTableData(compradorList, reportData[ventasKey].pesoComprador);
                if (JSON.stringify(syncedComprador) !== JSON.stringify(reportData[ventasKey].pesoComprador)) {
                    reportData[ventasKey].pesoComprador = syncedComprador;
                    needsSave = true;
                }

                // Sync zonaComercial
                const zonaList = listData[listKeys.zonaComercial] || [];
                const syncedZona = synchronizeTableData(zonaList, reportData[ventasKey].zonaComercial);
                if (JSON.stringify(syncedZona) !== JSON.stringify(reportData[ventasKey].zonaComercial)) {
                    reportData[ventasKey].zonaComercial = syncedZona;
                    needsSave = true;
                }

                // Sync agrupacionComercial
                const agrupacionList = listData[listKeys.agrupacionComercial] || [];
                const syncedAgrupacion = synchronizeTableData(agrupacionList, reportData[ventasKey].agrupacionComercial);
                 if (JSON.stringify(syncedAgrupacion) !== JSON.stringify(reportData[ventasKey].agrupacionComercial)) {
                    reportData[ventasKey].agrupacionComercial = syncedAgrupacion;
                    needsSave = true;
                }
            }

            // If synchronization happened, save the updated report
            if (needsSave) {
                await setDoc(reportRef, reportData, { merge: true });
            }

        } else {
            // Report doesn't exist, create a fresh one
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
  }, [user]);


  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    } else if (!authLoading && user) {
      fetchData();
    }
  }, [user, authLoading, router, fetchData]);

  const previousWeek = getPreviousWeekRange();
  const weekLabel = `${previousWeek.start} - ${previousWeek.end}`;

  const handleInputChange = (path: string, value: string | number) => {
    if (!isEditing) return;
    setData(prevData => {
        if (!prevData) return null;

        // Use deep copy to prevent state mutation issues
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
        current[finalKey] = isNaN(numericValue) ? value : numericValue;
        
        // --- Recalculation Logic ---
        if (path.startsWith('aqneSemanal.') && (finalKey === 'totalEuros' || path.includes('metricasPrincipales'))) {
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
    } catch (error) {
      console.error("Error saving document: ", error);
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: `No se pudieron guardar los cambios. ${error}`,
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
      setListToEdit(listKey);
      setListTitle(title);
      setListDialogOpen(true);
  };
  
 const handleSaveList = async (listKey: EditableList, newItems: string[]) => {
    if (!listKey) return;
    setIsSaving(true);
    try {
        const listsRef = doc(db, "configuracion", "listas");
        await updateDoc(listsRef, { [listKey]: newItems });

        await fetchData();

        toast({
            title: "Lista actualizada",
            description: `La lista "${listLabels[listKey]}" se ha guardado correctamente.`,
        });
    } catch (error) {
        console.error("Error saving list:", error);
        toast({
            variant: "destructive",
            title: "Error al guardar la lista",
            description: "No se pudo guardar la lista. Inténtalo de nuevo.",
        });
    } finally {
        setIsSaving(false);
        setListDialogOpen(false); 
        setListToEdit(null);
    }
};

const handleImageChange = async (path: string, file: File, onUploadComplete: (success: boolean) => void) => {
    if (!data) {
        onUploadComplete(false);
        return;
    }

    const storageRef = ref(storage, `informes/${data.periodo.toLowerCase().replace(' ', '-')}/${file.name}-${Date.now()}`);

    try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        handleInputChange(path, downloadURL);
        
        toast({
            title: "Imagen cargada",
            description: "La imagen está lista. Haz clic en 'Guardar' para confirmar todos los cambios.",
        });
        
        if (!isEditing) {
            setIsEditing(true);
        }

        onUploadComplete(true);

    } catch (error) {
        console.error("Error uploading image: ", error);
        toast({
            variant: "destructive",
            title: "Error al subir la imagen",
            description: "No se pudo subir la imagen. Comprueba tu conexión y los permisos de Firebase Storage.",
        });
        onUploadComplete(false);
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
          <TabsContent value="woman" className="mt-0">
            <VentasWomanTab 
              data={data}
              isEditing={isEditing} 
              onInputChange={handleInputChange}
              onImageChange={handleImageChange}
            />
          </TabsContent>
          <TabsContent value="nino" className="mt-0">
            <VentasNinoTab
              data={data}
              isEditing={isEditing}
              onInputChange={handleInputChange}
              onImageChange={handleImageChange}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      {listToEdit && (
        <EditListDialog
          isOpen={isListDialogOpen}
          onClose={() => {
            setListDialogOpen(false);
            setListToEdit(null);
          }}
          title={listTitle}
          items={data.listas[listToEdit] || []}
          onSave={(newItems) => {
            if (listToEdit) {
              handleSaveList(listToEdit, newItems);
            }
          }}
        />
      )}
    </div>
  );
}
