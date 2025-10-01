
"use client";

import React from 'react';
import type { PedidosData, Empleado } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type RankingEmpleadosCardProps = {
    ranking: PedidosData['rankingEmpleados'];
    isEditing: boolean;
    onInputChange: (path: string, value: string | number) => void;
    empleados: Empleado[];
    className?: string;
};

export function RankingEmpleadosCard({ ranking, isEditing, onInputChange, empleados, className }: RankingEmpleadosCardProps) {

    const handleInputChange = (index: number, field: 'id' | 'pedidos' | 'unidades', value: string) => {
        onInputChange(`pedidos.rankingEmpleados.${index}.${field}`, value);
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Ranking Empleados
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/4">ID Empleado</TableHead>
                            <TableHead className="w-1/2">Nombre</TableHead>
                            <TableHead className="w-1/4 text-right">Pedidos</TableHead>
                            <TableHead className="w-1/4 text-right">Unidades</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ranking.map((empleado, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {isEditing ? (
                                        <Select
                                            value={empleado.id}
                                            onValueChange={(value) => handleInputChange(index, 'id', value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecciona ID" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">
                                                    <span className="text-muted-foreground">-- Vacío --</span>
                                                </SelectItem>
                                                {empleados.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((e) => (
                                                    <SelectItem key={e.id} value={e.id}>
                                                        {e.id} - {e.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        empleado.id
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {empleado.nombre}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            defaultValue={empleado.pedidos}
                                            onBlur={(e) => handleInputChange(index, 'pedidos', e.target.value)}
                                            className="w-full text-right"
                                        />
                                    ) : (
                                        formatNumber(empleado.pedidos)
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            defaultValue={empleado.unidades}
                                            onBlur={(e) => handleInputChange(index, 'unidades', e.target.value)}
                                            className="w-full text-right"
                                        />
                                    ) : (
                                        formatNumber(empleado.unidades)
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
