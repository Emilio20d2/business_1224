import React from 'react';
import type { Empleado, PedidosData } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, User, Hash, Package, Boxes, Pencil } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import { Button } from '../ui/button';

type RankingEmpleadosCardProps = {
    ranking: PedidosData['rankingEmpleados'];
    empleados: Empleado[];
    isEditing: boolean;
    canEdit: boolean;
    onEditEmpleados: () => void;
    onInputChange: (path: string, value: string | number) => void;
};

export function RankingEmpleadosCard({ ranking, empleados, isEditing, canEdit, onEditEmpleados, onInputChange }: RankingEmpleadosCardProps) {
    
    const handleSelectChange = (rowIndex: number, employeeId: string) => {
        const valueToSave = employeeId === 'VACIO' ? '' : employeeId;
        onInputChange(`pedidos.rankingEmpleados.${rowIndex}.id`, valueToSave);
    };

    const handleValueChange = (rowIndex: number, field: 'pedidos' | 'unidades', value: string) => {
        onInputChange(`pedidos.rankingEmpleados.${rowIndex}.${field}`, value);
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Ranking de Empleados
                    </div>
                     {canEdit && (
                        <Button variant="ghost" size="icon" onClick={onEditEmpleados}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead><User className="h-4 w-4 inline-block mr-1"/>Empleado</TableHead>
                            <TableHead className="text-right"><Package className="h-4 w-4 inline-block mr-1"/>Pedidos</TableHead>
                            <TableHead className="text-right"><Boxes className="h-4 w-4 inline-block mr-1"/>Unidades</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ranking.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {isEditing ? (
                                        <Select
                                            value={item.id || 'VACIO'}
                                            onValueChange={(value) => handleSelectChange(index, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                 <SelectItem value="VACIO">
                                                    <span className="text-muted-foreground">-- Vacío --</span>
                                                </SelectItem>
                                                {empleados && empleados.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((e) => (
                                                    <SelectItem key={e.id} value={e.id}>
                                                        {e.id} - {e.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        item.nombre || <span className="text-muted-foreground">N/A</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            defaultValue={item.pedidos}
                                            onBlur={(e) => handleValueChange(index, 'pedidos', e.target.value)}
                                            className="w-24 ml-auto text-right"
                                        />
                                    ) : (
                                        formatNumber(item.pedidos)
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            defaultValue={item.unidades}
                                            onBlur={(e) => handleValueChange(index, 'unidades', e.target.value)}
                                            className="w-24 ml-auto text-right"
                                        />
                                    ) : (
                                        formatNumber(item.unidades)
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
