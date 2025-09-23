"use client"
import React, { useState, useContext, useEffect } from 'react';
import type { WeeklyData } from "@/lib/data";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, Loader2, ImagePlus, Upload, ArrowLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { AuthContext } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { getInitialLists, getInitialDataForWeek } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { EditListDialog } from '@/components/dashboard/edit-list-dialog';


type EditableList = 'comprador' | 'zonaComercial' | 'agrupacionComercial';

type PageData = {
    periodo: string;
    listas: WeeklyData['listas'];
    ventasMan: WeeklyData['ventasMan'];
};

type TableDataKey = keyof WeeklyData['ventasMan'];
type TableData = WeeklyData['ventasMan'][TableDataKey];
type TableItem = TableData[number];


const TrendIndicator = ({ value }: { value: number }) => {
  const trendColor = value >= 0 ? 'text-green-600' : 'text-red-600';
  return (
    <span className={cn("text-sm font-bold", trendColor)}>
      {value >= 0 ? '+' : ''}{value.toLocaleString('es-ES')}%
    </span>
  );
};

const DataTable = ({ data, headers, isEditing, allItems, onRowClick, dataKey, onInputChange, selectedIndex }: { data: TableData, headers: string[], isEditing: boolean, allItems: string[], onRowClick: (index: number) => void, dataKey: TableDataKey, onInputChange: (path: string, value: any) => void, selectedIndex: number | null }) => {
    if (!data) {
        return <p className="text-center text-muted-foreground mt-8">No hay datos disponibles.</p>;
    }

    const handleChange = (index: number, field: keyof TableItem, value: any) => {
        const path = `ventasMan.${dataKey}.${index}.${field}`;
        onInputChange(path, value);
    };

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        {headers.map((header, i) => (
                            <TableHead key={i} className={i === 0 ? '' : 'text-right'}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow
                            key={item.nombre + index}
                            onClick={() => onRowClick(index)}
                            className={cn("cursor-pointer", selectedIndex === index && 'bg-muted/50')}
                        >
                            <TableCell>
                                {isEditing ? (
                                    <Select value={item.nombre} onValueChange={(value) => handleChange(index, 'nombre', value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allItems.map(option => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    item.nombre
                                )}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.pesoPorc} onChange={(e) => handleChange(index, 'pesoPorc', e.target.value)} /> : formatPercentage(item.pesoPorc)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {isEditing ? <Input type="number" inputMode="decimal" className="w-24 ml-auto text-right" defaultValue={item.totalEuros} onChange={(e) => handleChange(index, 'totalEuros', e.target.value)} /> : formatCurrency(item.totalEuros)}
                            </TableCell>
                            <TableCell className="text-right">
                                {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.varPorc} onChange={(e) => handleChange(index, 'varPorc', e.target.value)} /> : <TrendIndicator value={item.varPorc} />}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

const ImageImportCard = ({ selectedRow, isEditing, onImageChange }: { selectedRow: TableItem | null, isEditing: boolean, onImageChange: (dataUrl: string) => void }) => {
    const displayImage = selectedRow?.imageUrl;
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onImageChange(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card className="relative overflow-hidden p-0 gap-0 w-full aspect-[16/9]">
            <CardContent className="p-0 h-full">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    {displayImage ? (
                        <img src={displayImage} alt={selectedRow?.nombre || 'Análisis Visual'} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <ImagePlus className="h-12 w-12" />
                            <p className="text-sm font-medium">Análisis Visual</p>
                            <p className="text-xs text-center">Selecciona una fila para ver o cambiar la imagen.</p>
                        </div>
                    )}
                </div>
                {isEditing && selectedRow && (
                     <div className="absolute bottom-2 right-2">
                        <Input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                        />
                        <Button onClick={handleButtonClick} variant="secondary">
                            <Upload className="mr-2 h-4 w-4" />
                            Cambiar Imagen
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};


export default function VentasManPage() {
    const { user, loading: authLoading, logout } = useContext(AuthContext);
    const router = useRouter();

    const [data, setData] = useState<PageData | null>(null);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isListDialogOpen, setIsListDialogOpen] = useState(false);
    const [listToEdit, setListToEdit] = useState<EditableList | null>(null);

    const [selectedCompradorIndex, setSelectedCompradorIndex] = React.useState<number | null>(0);
    const [selectedZonaIndex, setSelectedZonaIndex] = React.useState<number | null>(0);
    const [selectedAgrupacionIndex, setSelectedAgrupacionIndex] = React.useState<number | null>(0);


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
                        getDoc(listsSnap)
                    ]);

                    let pageData: PageData;
                    let listsData: WeeklyData['listas'];
                    
                    if (listsSnap.exists()) {
                        listsData = listsSnap.data() as WeeklyData['listas'];
                    } else {
                        listsData = getInitialLists();
                        await setDoc(listsRef, listsData);
                    }

                    if (reportSnap.exists()) {
                        const reportData = reportSnap.data() as WeeklyData;
                        pageData = {
                            periodo: reportData.periodo,
                            listas: listsData,
                            ventasMan: reportData.ventasMan,
                        };
                    } else {
                        // Create initial data if it doesn't exist
                        const initialReport = getInitialDataForWeek(week, listsData);
                        await setDoc(reportRef, initialReport);

                        pageData = {
                            periodo: initialReport.periodo,
                            listas: listsData,
                            ventasMan: initialReport.ventasMan,
                        };
                    }

                    setData(pageData);

                } catch (err: any) {
                    console.error("Error fetching or setting Firestore document:", err);
                    setError(`Error: ${err.message}.`);
                } finally {
                    setDataLoading(false);
                }
            };

            fetchData();
        }
    }, [user, authLoading, router]);

    const handleInputChange = (path: string, value: string | number) => {
        if (!data) return;
        setData(prevData => {
            if (!prevData) return null;
            const updatedData = JSON.parse(JSON.stringify(prevData));
            const keys = path.split('.');
            let current: any = updatedData;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            const finalKey = keys[keys.length - 1];
            const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
            current[finalKey] = isNaN(numericValue) ? value : numericValue;
            return updatedData;
        });
    };

    const handleImageChange = (dataKey: TableDataKey, index: number | null) => (dataUrl: string) => {
        if (index !== null) {
            const path = `ventasMan.${dataKey}.${index}.imageUrl`;
            handleInputChange(path, dataUrl);
        }
    };


    const handleSave = async () => {
        if (!data) return;
        setIsSaving(true);
        try {
            const docRef = doc(db, "informes", data.periodo.toLowerCase().replace(' ', '-'));
            await setDoc(docRef, { ventasMan: data.ventasMan }, { merge: true });
            toast({
                title: "¡Guardado!",
                description: "Los cambios en Ventas Man se han guardado.",
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
        // Here you might want to re-fetch data to discard changes
    };

    const handleSaveList = async (newList: string[]) => {
        if (!listToEdit || !data) return;

        const listsRef = doc(db, "configuracion", "listas");
        const reportRef = doc(db, "informes", data.periodo.toLowerCase().replace(' ', '-'));
        
        try {
            // 1. Create a deep copy to avoid direct state mutation
            const updatedData = JSON.parse(JSON.stringify(data));

            // 2. Update the list in the local state copy
            updatedData.listas[listToEdit] = newList;

            // 3. Sync the corresponding data table
            const dataKey = listToEdit as TableDataKey;
            const oldTableData: TableItem[] = updatedData.ventasMan[dataKey] || [];
            const oldDataMap = new Map(oldTableData.map(item => [item.nombre, item]));
            
            const newTableData = newList.map(itemName => {
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
            updatedData.ventasMan[dataKey] = newTableData;

            // 4. Set the new state to update the UI
            setData(updatedData);

            // 5. Save both the updated lists and the synced report data to Firestore
            await Promise.all([
                setDoc(listsRef, updatedData.listas),
                setDoc(reportRef, { ventasMan: updatedData.ventasMan }, { merge: true })
            ]);

            toast({
                title: "Lista y Datos Sincronizados",
                description: `La lista de ${listToEdit} y los datos del informe se han guardado.`
            });

        } catch (error) {
            console.error("Error saving list and synchronizing data:", error);
            toast({
                variant: "destructive",
                title: "Error al sincronizar",
                description: "No se pudo guardar la lista y sincronizar los datos.",
            });
        } finally {
            setIsListDialogOpen(false);
            setListToEdit(null);
        }
    };


    const handleOpenListDialog = (listName: EditableList) => {
        setListToEdit(listName);
        setIsListDialogOpen(true);
    };

    const getTitleForList = (listName: EditableList | null) => {
        switch (listName) {
            case 'comprador': return 'Editar Lista de Compradores';
            case 'zonaComercial': return 'Editar Lista de Zonas de Comprador';
            case 'agrupacionComercial': return 'Editar Agrupación Comercial';
            default: return 'Editar Lista';
        }
    };

    if (authLoading || dataLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4">{authLoading ? "Verificando sesión..." : "Cargando datos..."}</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-destructive">{error}</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p>No se encontraron datos.</p>
            </div>
        );
    }

    const selectedCompradorRow = selectedCompradorIndex !== null && data.ventasMan.pesoComprador?.[selectedCompradorIndex] ? data.ventasMan.pesoComprador[selectedCompradorIndex] : null;


    return (
        <div className="min-h-screen w-full p-4 sm:p-6 bg-background">
            <header className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                 <Button variant="outline" onClick={() => router.push('/dashboard')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Dashboard
                </Button>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Ventas Man
                </h1>
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
                                    <span>Agrupación Comercial</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Cerrar sesión</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <main>
                <Tabs defaultValue="comprador" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mx-auto max-w-md mb-4">
                        <TabsTrigger value="comprador">Comprador</TabsTrigger>
                        <TabsTrigger value="zonaComercial">Zona Comprador</TabsTrigger>
                        <TabsTrigger value="agrupacionComercial">Agrupación Comercial</TabsTrigger>
                    </TabsList>

                    <TabsContent value="comprador">
                        <div className="grid gap-4 items-start grid-cols-1 md:grid-cols-2">
                            <DataTable
                                data={data.ventasMan.pesoComprador}
                                headers={['COMPRADOR', 'PESO %', '€', '%']}
                                isEditing={isEditing}
                                allItems={data.listas.comprador}
                                onRowClick={setSelectedCompradorIndex}
                                dataKey="pesoComprador"
                                onInputChange={handleInputChange}
                                selectedIndex={selectedCompradorIndex}
                            />
                            <ImageImportCard
                                selectedRow={selectedCompradorRow}
                                isEditing={isEditing}
                                onImageChange={handleImageChange('pesoComprador', selectedCompradorIndex)}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="zonaComercial">
                        <div className="grid gap-4 items-start grid-cols-1">
                            <DataTable
                                data={data.ventasMan.zonaComercial}
                                headers={['ZONA COMPRADOR', 'PESO %', '€', '%']}
                                isEditing={isEditing}
                                allItems={data.listas.zonaComercial}
                                onRowClick={setSelectedZonaIndex}
                                dataKey="zonaComercial"
                                onInputChange={handleInputChange}
                                selectedIndex={selectedZonaIndex}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="agrupacionComercial">
                        <div className="grid gap-4 items-start grid-cols-1">
                            <DataTable
                                data={data.ventasMan.agrupacionComercial}
                                headers={['Agrupación Comercial', 'PESO %', '€', '%']}
                                isEditing={isEditing}
                                allItems={data.listas.agrupacionComercial}
                                onRowClick={setSelectedAgrupacionIndex}
                                dataKey="agrupacionComercial"
                                onInputChange={handleInputChange}
                                selectedIndex={selectedAgrupacionIndex}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            {listToEdit && (
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

    