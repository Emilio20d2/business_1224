
"use client";

import React from 'react';
import type { PedidosData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users } from 'lucide-react';
import { formatNumber } from '@/lib/format';

type RankingEmpleadosCardProps = {
    ranking: PedidosData['rankingEmpleados'];
    isEditing: boolean;
    onInputChange: (path: string, value: string | number) => void;
    className?: string;
};

export function RankingEmpleadosCard({ ranking, isEditing, onInputChange, className }: RankingEmpleadosCardProps) {

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
                                        <Input
                                            type="text"
                                            defaultValue={empleado.id}
                                            onBlur={(e) => handleInputChange(index, 'id', e.target.value)}
                                            className="w-full"
                                        />
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
