import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Save } from "lucide-react";
import type { Empleado } from '@/lib/data';
import { ScrollArea } from '../ui/scroll-area';

type EditEmpleadosDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  empleados: Empleado[];
  onSave: (empleados: Empleado[]) => void;
};

export function EditEmpleadosDialog({ isOpen, onClose, empleados, onSave }: EditEmpleadosDialogProps) {
  const [currentItems, setCurrentItems] = useState<Empleado[]>([]);
  const [newItem, setNewItem] = useState<Omit<Empleado, 'id'>>({ nombre: ''});
  const [newId, setNewId] = useState('');

  useEffect(() => {
    if (isOpen && empleados) {
      const sortedEmpleados = [...(empleados || [])].sort((a, b) => a.nombre.localeCompare(b.nombre));
      setCurrentItems(sortedEmpleados);
    }
  }, [empleados, isOpen]);

  const handleAddItem = () => {
    if (newId.trim() && newItem.nombre.trim() && !currentItems.some(item => item.id === newId.trim())) {
      const newEmployee: Empleado = { id: newId.trim(), nombre: newItem.nombre.trim() };
      const updatedItems = [...currentItems, newEmployee].sort((a, b) => a.nombre.localeCompare(b.nombre));
      setCurrentItems(updatedItems);
      setNewItem({ nombre: '' });
      setNewId('');
    }
  };

  const handleRemoveItem = (idToRemove: string) => {
    setCurrentItems(currentItems.filter(item => item.id !== idToRemove));
  };
  
  const handleItemChange = (index: number, field: keyof Empleado, value: string) => {
    const updatedItems = [...currentItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setCurrentItems(updatedItems);
  };


  const handleSave = () => {
    onSave(currentItems);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Lista de Empleados</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ScrollArea className="h-96 pr-4">
            <div className="space-y-2">
                 <div className="grid grid-cols-[1fr_2fr_auto] gap-2 px-1 font-semibold text-sm">
                    <div>ID</div>
                    <div>Nombre</div>
                    <div></div>
                </div>
              {currentItems.map((item, index) => (
                <div key={`${item.id}-${index}`} className="grid grid-cols-[1fr_2fr_auto] items-center gap-2">
                  <Input 
                    value={item.id || ''}
                    onChange={(e) => handleItemChange(index, 'id', e.target.value)}
                  />
                  <Input 
                    value={item.nombre || ''}
                    onChange={(e) => handleItemChange(index, 'nombre', e.target.value)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="mt-6 pt-4 border-t">
             <h4 className="text-lg font-medium mb-2">Añadir Nuevo Empleado</h4>
             <div className="grid grid-cols-[1fr_2fr_auto] items-center gap-2">
                <Input
                  placeholder="ID del empleado"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Input
                  placeholder="Nombre del empleado"
                  value={newItem.nombre}
                  onChange={(e) => setNewItem({ nombre: e.target.value })}
                  onKeyDown={handleKeyDown}
                />
                <Button onClick={handleAddItem} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
             </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
             <Save className="mr-2 h-4 w-4"/>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
