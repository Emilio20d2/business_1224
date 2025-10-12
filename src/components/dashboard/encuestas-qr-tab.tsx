
"use client";

import React from 'react';
import type { EncuestasQrData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Shirt, Box, Receipt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type EncuestasQrTabProps = {
    data: EncuestasQrData;
    isEditing: boolean;
    onInputChange: (path: string, value: string | number) => void;
};

const Column = ({ icon, label, value, isEditing, valueId, onInputChange, isTotal, isInt }: { 
    icon?: React.ReactNode, 
    label: string, 
    value: number,
    isEditing: boolean,
    valueId: string,
    onInputChange: (path: string, value: string | number) => void,
    isTotal?: boolean,
    isInt?: boolean
}) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (isInt) {
            onInputChange(valueId, parseInt(val, 10) || 0);
        } else {
             onInputChange(valueId, parseFloat(val.replace(',', '.')) || 0);
        }
    };
    
    const formatValue = (val: number) => {
        if (val === null || val === undefined || isNaN(val)) return isInt ? '0' : '0,00';
        return isInt ? String(val) : val.toFixed(2).replace('.', ',');
    };

    return (
        <div className="flex flex-col items-center gap-4 text-center">
            {icon && <div className="text-primary">{icon}</div>}
            <span className="text-sm font-semibold uppercase text-muted-foreground h-10 flex items-center">{label}</span>
            {isEditing && !isTotal ? (
                <Input
                    type="number"
                    step={isInt ? "1" : "0.01"}
                    defaultValue={value}
                    onBlur={handleChange}
                    className="w-20 text-center"
                />
            ) : (
                <div className={cn("text-xl font-bold h-10 flex items-center justify-center rounded-md w-full", isTotal && "bg-muted")}>
                    {formatValue(value)}
                </div>
            )}
        </div>
    );
};


export function EncuestasQrTab({ data, isEditing, onInputChange }: EncuestasQrTabProps) {
    if (!data) return null;

    const { respuestas, planta, tallas, online, probador, caja, respuestasPositivas, aMejorar } = data;
    const total = (planta + tallas + online + probador + caja) / 5;

    const items = [
        { icon: undefined, label: 'Respuestas', value: respuestas, valueId: 'encuestasQr.respuestas', isInt: true },
        { icon: <User size={32}/>, label: 'Planta', value: planta, valueId: 'encuestasQr.planta' },
        { icon: <Shirt size={32}/>, label: 'Tallas', value: tallas, valueId: 'encuestasQr.tallas' },
        { icon: <Box size={32}/>, label: 'Online', value: online, valueId: 'encuestasQr.online' },
        { icon: <Shirt size={32}/>, label: 'Probador', value: probador, valueId: 'encuestasQr.probador' },
        { icon: <Receipt size={32}/>, label: 'Caja', value: caja, valueId: 'encuestasQr.caja' },
    ];

    const handleTextChange = (path: string, value: string) => {
        onInputChange(path, value);
    };


    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-7 items-start gap-4 border-b pb-4">
                        {items.map(item => (
                            <Column
                                key={item.label}
                                icon={item.icon}
                                label={item.label}
                                value={item.value}
                                isEditing={isEditing}
                                valueId={item.valueId}
                                onInputChange={onInputChange}
                                isInt={item.isInt}
                            />
                        ))}
                        <Column
                            label="Total"
                            value={total}
                            isEditing={isEditing}
                            valueId="total" // Not editable
                            onInputChange={() => {}}
                            isTotal={true}
                        />
                    </div>
                </CardContent>
            </Card>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>RESPUESTAS POSITIVAS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="positiva-1">Respuesta 1</Label>
                             {isEditing ? (
                                <Textarea
                                    id="positiva-1"
                                    value={respuestasPositivas?.respuesta1 || ''}
                                    onChange={(e) => handleTextChange('encuestasQr.respuestasPositivas.respuesta1', e.target.value)}
                                    rows={3}
                                />
                             ) : (
                                <p className="text-sm min-h-[60px] p-2 border rounded-md bg-muted/50">{respuestasPositivas?.respuesta1 || '-'}</p>
                             )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="positiva-2">Respuesta 2</Label>
                            {isEditing ? (
                                <Textarea
                                    id="positiva-2"
                                    value={respuestasPositivas?.respuesta2 || ''}
                                    onChange={(e) => handleTextChange('encuestasQr.respuestasPositivas.respuesta2', e.target.value)}
                                    rows={3}
                                />
                            ) : (
                                <p className="text-sm min-h-[60px] p-2 border rounded-md bg-muted/50">{respuestasPositivas?.respuesta2 || '-'}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>A MEJORAR</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="mejorar-1">Respuesta 1</Label>
                            {isEditing ? (
                                <Textarea
                                    id="mejorar-1"
                                    value={aMejorar?.respuesta1 || ''}
                                    onChange={(e) => handleTextChange('encuestasQr.aMejorar.respuesta1', e.target.value)}
                                    rows={3}
                                />
                            ) : (
                                <p className="text-sm min-h-[60px] p-2 border rounded-md bg-muted/50">{aMejorar?.respuesta1 || '-'}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mejorar-2">Respuesta 2</Label>
                            {isEditing ? (
                                <Textarea
                                    id="mejorar-2"
                                    value={aMejorar?.respuesta2 || ''}
                                    onChange={(e) => handleTextChange('encuestasQr.aMejorar.respuesta2', e.target.value)}
                                    rows={3}
                                />
                             ) : (
                                <p className="text-sm min-h-[60px] p-2 border rounded-md bg-muted/50">{aMejorar?.respuesta2 || '-'}</p>
                             )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
