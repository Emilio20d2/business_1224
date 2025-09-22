"use client"
import React, { useState, useContext, useEffect } from 'react';
import type { WeeklyData } from "@/lib/data";
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
import { DatosPorSeccionTab } from "@/components/dashboard/datos-por-seccion-tab";
import { VentasManTab } from "@/components/dashboard/ventas-man-tab";
import { AqneSemanalTab } from "@/components/dashboard/aqne-semanal-tab";
import { AcumuladoTab } from "@/components/dashboard/acumulado-tab";
import { FocusSemanalTab } from '@/components/dashboard/focus-semanal-tab';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { EditListDialog } from '@/components/dashboard/edit-list-dialog';
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/context/auth-context';
import { getInitialDataForWeek } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';


type EditableList = 'comprador' | 'zonaComercial' | 'agrupacionComercial';

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

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useContext(AuthContext);
  const router = useRouter();

  const [data, setData] = useState<WeeklyData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<EditableList | null>(null);

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
          const docRef = doc(db, "informes", week);
          console.log(`Fetching document for user: ${user.uid}`);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log("Data found in Firestore.");
            setData(docSnap.data() as WeeklyData);
          } else {
            console.log("No data in Firestore, creating with initial data.");
            const initialData = getInitialDataForWeek(week);
            await setDoc(docRef, initialData);
            setData(initialData);
          }
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

  const listOptions = (data && data.listas) ? {
    comprador: data.listas.comprador,
    zonaComercial: data.listas.zonaComercial,
    agrupacionComercial: data.listas.agrupacionComercial,
  } : { comprador: [], zonaComercial: [], agrupacionComercial: [] };

  const previousWeek = getPreviousWeekRange();
  const weekLabel = `${previousWeek.start} - ${previousWeek.end}`;

 const handleInputChange = (path: string, value: string | number) => {
    if (!data) return;

    setData(prevData => {
        if (!prevData) return null;

        const updatedData = JSON.parse(JSON.stringify(prevData));
        const keys = path.split('.');
        let current = updatedData;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (current[key] === undefined) {
                 console.error(`Invalid path for input change: ${path}. Key "${key}" not found.`);
                 return prevData;
            }
            current = current[key];
        }
        
        const finalKey = keys[keys.length - 1];
        
        // Handle array index access
        const arrayMatch = finalKey.match(/(\w+)\[(\d+)\]/);
        if(arrayMatch){
            const arrayKey = arrayMatch[1];
            const index = parseInt(arrayMatch[2], 10);
            if (current[arrayKey] && current[arrayKey][index]) {
                const itemKey = keys[keys.length - 1].split('.')[1];
                current[arrayKey][index] = value;
            }
            return updatedData;
        }

        const target = current[finalKey];

        if (typeof target === 'number') {
            const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
            current[finalKey] = isNaN(numericValue) ? 0 : numericValue;
        } else {
            current[finalKey] = value;
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
    // You might want to re-fetch or reset to original data state here
  };

  const handleOpenListDialog = (listName: EditableList) => {
    setListToEdit(listName);
    setIsListDialogOpen(true);
  };

  const handleSaveList = (newList: string[]) => {
    if (listToEdit && data) {
      const updatedData = JSON.parse(JSON.stringify(data));
  
      updatedData.listas[listToEdit] = newList;
  
      let listKey: 'pesoComprador' | 'zonaComercial' | 'agrupacionComercial';
      switch (listToEdit) {
        case 'comprador':
          listKey = 'pesoComprador';
          break;
        case 'zonaComercial':
          listKey = 'zonaComercial';
          break;
        case 'agrupacionComercial':
          listKey = 'agrupacionComercial';
          break;
        default:
          return;
      }
      
      const currentItems = updatedData.ventasMan[listKey];
      const newItemsList: any[] = [];
  
      // Add existing items that are in the new list, and new items
      for (const itemName of newList) {
        const existingItem = currentItems.find((item: any) => item.nombre === itemName);
        if (existingItem) {
          newItemsList.push(existingItem);
        } else {
          const newItem: any = {
            nombre: itemName,
            pesoPorc: 0,
            totalEuros: 0,
            varPorc: 0,
          };
          if (listKey === 'pesoComprador') {
            newItem.imageUrl = `https://picsum.photos/seed/${itemName.replace(/\s/g, '')}/500/400`;
          }
          newItemsList.push(newItem);
        }
      }
      
      updatedData.ventasMan[listKey] = newItemsList.filter((item: any) => newList.includes(item.nombre));
      
      setData(updatedData);
      setIsEditing(true);
      console.log("Updated data after list edit:", updatedData);
    }
    setListToEdit(null);
    setIsListDialogOpen(false);
  };

  const getTitleForList = (listName: EditableList | null) => {
    switch (listName) {
      case 'comprador': return 'Editar Lista de Compradores';
      case 'zonaComercial': return 'Editar Lista de Zonas de Comprador';
      case 'agrupacionComercial': return 'Editar Lista de Agrupaciones Comerciales';
      default: return 'Editar Lista';
    }
  }

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

  if (!data || !data.listas) {
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
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          BUSSINES MAN
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="semana-select" className="text-sm font-medium text-muted-foreground">Informe:</label>
             <Select value="previous-week">
              <SelectTrigger id="semana-select" className="w-[220px]">
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
              <Button onClick={() => setIsEditing(true)} variant="outline">Editar</Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-50">
                <DropdownMenuLabel>Editar Listas de Categorías</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => handleOpenListDialog('comprador')}>
                      <span>COMPRADOR</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleOpenListDialog('zonaComercial')}>
                      <span>ZONA COMPRADOR</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleOpenListDialog('agrupacionComercial')}>
                      <span>AGRUPACION COMERCIAL</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                 <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => {
                  logout();
                }}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main>
        <Tabs defaultValue="datosSemanales">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="mb-4 inline-flex md:grid md:w-full md:grid-cols-6">
              <TabsTrigger value="datosSemanales">Datos Semanales</TabsTrigger>
              <TabsTrigger value="ventasSeccion">Ventas Sección</TabsTrigger>
              <TabsTrigger value="ventasMan">Ventas Man</TabsTrigger>
              <TabsTrigger value="aqneSemanal">AQNE Semanal</TabsTrigger>
              <TabsTrigger value="acumulado">Acumulado</TabsTrigger>
              <TabsTrigger value="focusSemanal">Focus Semanal</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="datosSemanales">
            <DatosSemanalesTab data={data} isEditing={isEditing} onInputChange={handleInputChange} />
          </TabsContent>
          <TabsContent value="ventasSeccion">
             <DatosPorSeccionTab data={data.datosPorSeccion} isEditing={isEditing} onInputChange={handleInputChange} />
          </TabsContent>
           <TabsContent value="ventasMan">
             <VentasManTab data={data.ventasMan} isEditing={isEditing} listOptions={listOptions} onInputChange={handleInputChange} />
          </TabsContent>
           <TabsContent value="aqneSemanal">
             <AqneSemanalTab data={data} isEditing={isEditing} onInputChange={handleInputChange} />
          </TabsContent>
           <TabsContent value="acumulado">
             <AcumuladoTab data={data.acumulado} isEditing={isEditing} onInputChange={handleInputChange} />
          </TabsContent>
          <TabsContent value="focusSemanal">
            <FocusSemanalTab text={data.focusSemanal} isEditing={isEditing} onInputChange={handleInputChange} />
          </TabsContent>
        </Tabs>
      </main>

      {listToEdit && (
        <EditListDialog
          isOpen={isListDialogOpen}
          onClose={() => setIsListDialogOpen(false)}
          title={getTitleForList(listToEdit)}
          items={listOptions[listToEdit]}
          onSave={handleSaveList}
        />
      )}
    </div>
  );
}

    