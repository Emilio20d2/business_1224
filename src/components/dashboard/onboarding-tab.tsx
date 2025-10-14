"use client";

import React from 'react';
import type { WeeklyData, Empleado, IncorporacionItem } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Users } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type OnboardingTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any) => void;
  setData: React.Dispatch<React.SetStateAction<WeeklyData | null>>;
};

export function OnboardingTab({ data, isEditing, onInputChange, setData }: OnboardingTabProps) {
  const { incorporaciones, listas } = data;

  const handleIncorporacionChange = (index: number, field: keyof IncorporacionItem, value: any) => {
    onInputChange(`incorporaciones.${index}.${field}`, value);
  };

  const handleEmployeeSelect = (index: number, employeeId: string) => {
    if (employeeId === 'VACIO') {
      handleIncorporacionChange(index, 'idEmpleado', '');
      handleIncorporacionChange(index, 'nombreEmpleado', '');
    } else {
      const employee = listas.empleados.find(e => e.id === employeeId);
      if (employee) {
        handleIncorporacionChange(index, 'idEmpleado', employee.id);
        handleIncorporacionChange(index, 'nombreEmpleado', employee.nombre);
      }
    }
  };
  
  const handleAddIncorporacion = () => {
    setData(prevData => {
        if (!prevData) return null;
        const newIncorporacion: IncorporacionItem = {
            id: uuidv4(),
            idEmpleado: '',
            nombreEmpleado: '',
            prl: false,
            diHola: false,
        };
        const updatedIncorporaciones = [...(prevData.incorporaciones || []), newIncorporacion];
        return { ...prevData, incorporaciones: updatedIncorporaciones };
    });
  };
  
  const handleRemoveIncorporacion = (id: string) => {
      setData(prevData => {
          if (!prevData) return null;
          const updatedIncorporaciones = prevData.incorporaciones.filter(item => item.id !== id);
          return { ...prevData, incorporaciones: updatedIncorporaciones };
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          INCORPORACIONES
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Seleccionar Empleado</TableHead>
              <TableHead className="w-[150px]">ID (Nuevo)</TableHead>
              <TableHead>Nombre (Nuevo)</TableHead>
              <TableHead className="text-center">PRL</TableHead>
              <TableHead className="text-center">DI HOLA!</TableHead>
              {isEditing && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {incorporaciones && incorporaciones.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  {isEditing ? (
                     <Select
                        value={item.idEmpleado && listas.empleados.some(e => e.id === item.idEmpleado) ? item.idEmpleado : 'VACIO'}
                        onValueChange={(value) => handleEmployeeSelect(index, value)}
                     >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="VACIO">-- Nuevo Empleado --</SelectItem>
                            {listas.empleados.map(e => (
                                <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  ) : (
                    item.nombreEmpleado
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                     <Input
                        value={item.idEmpleado && listas.empleados.some(e => e.id === item.idEmpleado) ? '' : item.idEmpleado}
                        onChange={(e) => handleIncorporacionChange(index, 'idEmpleado', e.target.value)}
                        placeholder="ID..."
                        disabled={!!item.idEmpleado && listas.empleados.some(e => e.id === item.idEmpleado)}
                     />
                  ) : (
                    item.idEmpleado
                  )}
                </TableCell>
                 <TableCell>
                  {isEditing ? (
                     <Input
                        value={item.idEmpleado && listas.empleados.some(e => e.id === item.idEmpleado) ? (listas.empleados.find(e=> e.id === item.idEmpleado)?.nombre || '') : item.nombreEmpleado}
                        onChange={(e) => handleIncorporacionChange(index, 'nombreEmpleado', e.target.value)}
                        placeholder="Nombre..."
                        disabled={!!item.idEmpleado && listas.empleados.some(e => e.id === item.idEmpleado)}
                     />
                  ) : (
                    null
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={item.prl}
                    onCheckedChange={(checked) => handleIncorporacionChange(index, 'prl', checked)}
                    disabled={!isEditing}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={item.diHola}
                    onCheckedChange={(checked) => handleIncorporacionChange(index, 'diHola', checked)}
                    disabled={!isEditing}
                  />
                </TableCell>
                {isEditing && (
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveIncorporacion(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isEditing && (
          <Button onClick={handleAddIncorporacion} variant="outline" className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Añadir Fila
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
