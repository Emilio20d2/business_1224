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

type HolaTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any) => void;
  setData: React.Dispatch<React.SetStateAction<WeeklyData | null>>;
};

export function HolaTab({ data, isEditing, onInputChange, setData }: HolaTabProps) {
  const { incorporaciones, listas } = data;

  const handleIncorporacionChange = (index: number, field: keyof IncorporacionItem, value: any) => {
    onInputChange(`incorporaciones.${index}.${field}`, value);
  };
  
  const handleAddIncorporacion = () => {
    setData(prevData => {
        if (!prevData) return null;
        const newIncorporacion: IncorporacionItem = {
            id: uuidv4(),
            idEmpleado: '',
            nombreEmpleado: '',
            somosZara: false,
            intalent: false,
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
              <TableHead className="w-[150px]">ID Empleado</TableHead>
              <TableHead>Empleado</TableHead>
              <TableHead className="text-center">SOMOS ZARA</TableHead>
              <TableHead className="text-center">INTALENT</TableHead>
              <TableHead className="text-center">DI HOLA!</TableHead>
              {isEditing && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {incorporaciones.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  {isEditing ? (
                     <Input
                        value={item.idEmpleado}
                        onChange={(e) => handleIncorporacionChange(index, 'idEmpleado', e.target.value)}
                        placeholder="ID..."
                     />
                  ) : (
                    item.idEmpleado
                  )}
                </TableCell>
                <TableCell>
                   {isEditing ? (
                     <Input
                        value={item.nombreEmpleado}
                        onChange={(e) => handleIncorporacionChange(index, 'nombreEmpleado', e.target.value)}
                        placeholder="Nombre..."
                     />
                  ) : (
                    item.nombreEmpleado
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={item.somosZara}
                    onCheckedChange={(checked) => handleIncorporacionChange(index, 'somosZara', checked)}
                    disabled={!isEditing}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    checked={item.intalent}
                    onCheckedChange={(checked) => handleIncorporacionChange(index, 'intalent', checked)}
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
