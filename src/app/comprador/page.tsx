"use client";
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from '@/lib/firebase';
import { AuthContext } from '@/context/auth-context';
import type { VentasManItem, WeeklyData } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Loader2, Pencil, Home, Briefcase, ImagePlus, Upload, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercentage } from "@/lib/format";

const WEEK_ID = "semana-24";
const REPORT_REF = doc(db, "informes", WEEK_ID);
const LISTS_REF = doc(db, "configuracion", "listas");

// A simplified version for local state
type CompradorData = {
    pesoComprador: VentasManItem[];
    compradorManList: string[];
}

const TrendIndicator = ({ value }: { value: number }) => {
    const trendColor = value >= 0 ? 'text-green-600' : 'text-red-600';
    const sign = value >= 0 ? '+' : '';
    return (
        <span className={cn("text-sm font-bold", trendColor)}>
            {sign}{value.toLocaleString('es-ES')}%
        </span>
    );
};

const ImageImportCard = ({ selectedRow, isEditing, onImageChange, imageUrl }: { selectedRow: VentasManItem | null, isEditing: boolean, onImageChange: (file: File, onComplete: (success: boolean) => void) => void, imageUrl: string | null }) => {
    const [isUploading, setIsUploading] = React.useState(false);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            onImageChange(file, (success) => {
                setIsUploading(false);
            });
        }
        event.target.value = '';
    };

    return (
        <Card className="relative overflow-hidden p-0 gap-0 w-full aspect-[16/9]">
            <div className="w-full h-full bg-muted flex items-center justify-center">
                {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                        <Loader2 className="h-12 w-12 text-white animate-spin" />
                    </div>
                )}
                {imageUrl ? (
                    <img src={imageUrl} alt={selectedRow?.nombre || 'Análisis Visual'} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImagePlus className="h-12 w-12" />
                        <p className="text-sm font-medium">Análisis Visual</p>
                        <p className="text-xs text-center">Selecciona una fila para ver o cambiar la imagen.</p>
                    </div>
                )}
            </div>
            {isEditing && selectedRow && (
                <div className="absolute bottom-2 right-2 z-20">
                    <Button asChild variant="secondary" disabled={isUploading}>
                        <label htmlFor="file-upload-comprador">
                            <Upload className="mr-2 h-4 w-4" />
                            Cambiar Imagen
                            <input id="file-upload-comprador" type="file" onChange={handleImageUpload} className="sr-only" accept="image/*" disabled={isUploading} />
                        </label>
                    </Button>
                </div>
            )}
        </Card>
    );
};


export default function CompradorPage() {
    const { user, loading: authLoading } = useContext(AuthContext);
    const router = useRouter();
    const { toast } = useToast();

    const [data, setData] = useState<CompradorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);

    const canEdit = user?.email === 'emiliogp@inditex.com';

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const [reportSnap, listsSnap] = await Promise.all([getDoc(REPORT_REF), getDoc(LISTS_REF)]);
            
            if (!reportSnap.exists() || !listsSnap.exists()) {
                 throw new Error("No se encontraron datos. Por favor, vuelve al dashboard principal para inicializar el informe.");
            }

            const reportData = reportSnap.data() as WeeklyData;
            const listsData = listsSnap.data() as WeeklyData['listas'];
            
            setData({
                pesoComprador: reportData.ventasMan?.pesoComprador || [],
                compradorManList: listsData.compradorMan || []
            });

        } catch (err: any) {
            setError(err.message);
            toast({ variant: "destructive", title: "Error", description: err.message });
        } finally {
            setLoading(false);
        }
    }, [user, toast]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        } else if (user) {
            fetchData();
        }
    }, [user, authLoading, router, fetchData]);

    const handleInputChange = (index: number, field: keyof VentasManItem, value: any) => {
        if (!isEditing || !data) return;

        const updatedTable = [...data.pesoComprador];
        const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
        (updatedTable[index] as any)[field] = isNaN(numericValue) || value === "" ? value : numericValue;

        setData({ ...data, pesoComprador: updatedTable });
    };

    const handleImageChange = (file: File, onComplete: (success: boolean) => void) => {
        if (!data || selectedIndex === null) {
            onComplete(false);
            return;
        }

        const storageRef = ref(storage, `informes/${WEEK_ID}/comprador/${file.name}-${Date.now()}`);

        uploadBytes(storageRef, file).then(snapshot => {
            getDownloadURL(snapshot.ref).then(downloadURL => {
                handleInputChange(selectedIndex, 'imageUrl', downloadURL);
                onComplete(true);
                toast({ title: "Imagen subida", description: "Haz clic en 'Guardar' para confirmar los cambios." });
            });
        }).catch(error => {
            console.error("Error al subir la imagen: ", error);
            toast({ variant: "destructive", title: "Error de carga", description: "No se pudo subir la imagen." });
            onComplete(false);
        });
    };

    const handleSave = async () => {
        if (!data) return;
        setIsSaving(true);
        try {
            await updateDoc(REPORT_REF, { "ventasMan.pesoComprador": data.pesoComprador });
            toast({ title: "¡Guardado!", description: "Los cambios se han guardado correctamente." });
            setIsEditing(false);
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error al guardar", description: error.message });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        fetchData();
    };

    if (authLoading || loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
     if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center p-4">
                <p className="text-lg font-semibold text-destructive">Error al Cargar Datos</p>
                <p className="text-muted-foreground">{error}</p>
                 <Button onClick={() => router.push('/dashboard')} className="mt-4">
                    <Home className="mr-2 h-4 w-4" />
                    Volver al Dashboard
                </Button>
            </div>
        );
    }


    if (!data) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <p>No hay datos disponibles.</p>
                 <Button onClick={() => router.push('/dashboard')} className="mt-4 ml-4">
                    <Home className="mr-2 h-4 w-4" />
                    Volver al Dashboard
                </Button>
            </div>
        );
    }
    
    const selectedRow = selectedIndex !== null ? data.pesoComprador[selectedIndex] : null;
    const imageUrl = selectedRow?.imageUrl || null;

    return (
        <div className="h-screen w-full flex flex-col p-2 sm:p-4">
            <header className="mb-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.push('/dashboard')}>
                        <Home className="h-4 w-4 text-primary" />
                    </Button>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Briefcase className="h-6 w-6" />
                        Comprador MAN
                    </h1>
                </div>
                {canEdit && (
                    <div className="flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <Button onClick={handleSave} disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Guardar
                                </Button>
                                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>Cancelar</Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)} variant="outline">
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                        )}
                    </div>
                )}
            </header>

            <main className="flex-1 grid gap-4 items-start grid-cols-1 lg:grid-cols-2">
                <Card className="h-full overflow-y-auto">
                    <Table>
                        <TableHeader className="sticky top-0 bg-card z-10">
                            <TableRow>
                                {['COMPRADOR', 'PESO %', '€', '%'].map((header, i) => (
                                    <TableHead key={i} className={cn('uppercase font-bold', i === 0 ? '' : 'text-right')}>{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.pesoComprador.map((item, index) => (
                                <TableRow
                                    key={item.nombre + index}
                                    onClick={() => setSelectedIndex(index)}
                                    className={cn('cursor-pointer', selectedIndex === index && 'bg-muted/50')}
                                >
                                    <TableCell className="font-medium">
                                        {isEditing ? (
                                            <Select
                                                value={item.nombre}
                                                onValueChange={(value) => handleInputChange(index, 'nombre', value)}
                                            >
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    {data.compradorManList.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            item.nombre
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.pesoPorc} onChange={(e) => handleInputChange(index, 'pesoPorc', e.target.value)} /> : formatPercentage(item.pesoPorc)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {isEditing ? <Input type="number" inputMode="decimal" className="w-24 ml-auto text-right" defaultValue={item.totalEuros} onChange={(e) => handleInputChange(index, 'totalEuros', e.target.value)} /> : formatCurrency(item.totalEuros)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.varPorc} onChange={(e) => handleInputChange(index, 'varPorc', e.target.value)} /> : <TrendIndicator value={item.varPorc} />}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
                <div className="flex items-start">
                   <ImageImportCard selectedRow={selectedRow} isEditing={isEditing} onImageChange={handleImageChange} imageUrl={imageUrl} />
                </div>
            </main>
        </div>
    );
}
