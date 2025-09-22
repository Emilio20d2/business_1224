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
    // This effect ensures we only fetch data when the user is confirmed.
    if (!authLoading && user) {
      const fetchData = async () => {
        setDataLoading(true);
        setError(null);
        console.log(`Auth state confirmed. User UID: ${user.uid}. Fetching Firestore data...`);
        try {
          const week = "semana-24";
          const docRef = doc(db, "informes", week);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            console.log("Data found in Firestore.");
            setData(docSnap.data() as WeeklyData);
          } else {
            console.log("No data in Firestore for this week, creating with initial data.");
            const initialData = getInitialDataForWeek(week);
            await setDoc(docRef, initialData);
            setData(initialData);
            console.log("Initial data set in Firestore.");
          }
        } catch (err: any) {
          console.error("Error fetching or setting Firestore document:", err);
          setError(`Error: ${err.message} (Code: ${err.code})`);
        } finally {
          setDataLoading(false);
        }
      };
      
      fetchData();

    } else if (!authLoading && !user) {
      // If auth has loaded and there's no user, redirect to login.
      router.push('/');
    }
    // If auth is still loading, we do nothing and wait.
  }, [user, authLoading, router]);

  const listOptions = data ? {
    comprador: data.ventasMan.pesoComprador.map(item => item.nombre),
    zonaComercial: data.ventasMan.zonaComercial.map(item => item.nombre),
    agrupacionComercial: data.ventasMan.agrupacionComercial.map(item => item.nombre),
  } : { comprador: [], zonaComercial: [], agrupacionComercial: [] };

  const previousWeek = getPreviousWeekRange();
  const weekLabel = `${previousWeek.start} - ${previousWeek.end}`;

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
      const updatedData = { ...data };
      const listKey = listToEdit === 'comprador' ? 'pesoComprador' : listToEdit === 'zonaComercial' ? 'zonaComercial' : 'agrupacionComercial';
      
      updatedData.ventasMan[listKey] = updatedData.ventasMan[listKey].filter(item => newList.includes(item.nombre));
      
      const existingNames = updatedData.ventasMan[listKey].map(item => item.nombre);
      newList.forEach(name => {
        if (!existingNames.includes(name)) {
          updatedData.ventasMan[listKey].push({
            nombre: name,
            pesoPorc: 0,
            totalEuros: 0,
            varPorc: 0,
            imageUrl: `https://picsum.photos/seed/${name.replace(/\s/g, '')}/500/400`
          });
        }
      });

      setData(updatedData);
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

  // Unified loading state
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
        <p>No se pudieron cargar los datos o no hay usuario autenticado.</p>
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
              <DropdownMenuContent className="w-56">
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
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 mb-4">
            <TabsTrigger value="datosSemanales">Datos Semanales</TabsTrigger>
            <TabsTrigger value="ventasSeccion">Ventas Sección</TabsTrigger>
            <TabsTrigger value="ventasMan">Ventas Man</TabsTrigger>
            <TabsTrigger value="aqneSemanal">AQNE Semanal</TabsTrigger>
            <TabsTrigger value="acumulado">Acumulado</TabsTrigger>
          </TabsList>
          <TabsContent value="datosSemanales">
            <DatosSemanalesTab data={data} isEditing={isEditing} />
          </TabsContent>
          <TabsContent value="ventasSeccion">
             <DatosPorSeccionTab data={data.datosPorSeccion} />
          </TabsContent>
           <TabsContent value="ventasMan">
             <VentasManTab data={data.ventasMan} isEditing={isEditing} listOptions={listOptions} />
          </TabsContent>
           <TabsContent value="aqneSemanal">
             <AqneSemanalTab data={data} />
          </TabsContent>
           <TabsContent value="acumulado">
             <AcumuladoTab data={data.acumulado} isEditing={isEditing} />
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
