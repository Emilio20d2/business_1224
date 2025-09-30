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
import { X, Plus, Edit, Save, Ban } from "lucide-react";
import type { Empleado } from '@/lib/data';

type EditEmpleadosDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  empleados: Empleado[];
  onSave: (empleados: Empleado[]) => void;
};

export function EditEmpleadosDialog({ isOpen, onClose, empleados, onSave }: EditEmpleadosDialogProps) {
  const [currentItems, setCurrentItems] = useState<Empleado[]>([]);
  const [newItem, setNewItem] = useState<Empleado>({ id: '', nombre: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<Empleado | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentItems([...empleados].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    }
  }, [empleados, isOpen]);

  const handleAddItem = () => {
    if (newItem.id.trim() && newItem.nombre.trim()) {
      const updatedItems = [...currentItems, newItem].sort((a, b) => a.nombre.localeCompare(b.nombre));
      setCurrentItems(updatedItems);
      setNewItem({ id: '', nombre: '' });
    }
  };

  const handleRemoveItem = (idToRemove: string) => {
    setCurrentItems(currentItems.filter(item => item.id !== idToRemove));
  };

  const handleSave = () => {
    onSave(currentItems);
    onClose();
  };
  
  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedItem({ ...currentItems[index] });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedItem(null);
  }

  const handleSaveEdit = () => {
    if (editedItem && editingIndex !== null) {
      const updatedItems = [...currentItems];
      updatedItems[editingIndex] = editedItem;
      setCurrentItems(updatedItems.sort((a, b) => a.nombre.localeCompare(b.nombre)));
      handleCancelEdit();
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if(e.currentTarget.name === 'nombre') {
         handleAddItem();
      } else {
         const nextInput = document.querySelector<HTMLInputElement>('input[name="nombre"]');
         nextInput?.focus();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar Lista de Empleados</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {currentItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {editingIndex === index && editedItem ? (
                   <>
                    <Input value={editedItem.id} onChange={(e) => setEditedItem({...editedItem, id: e.target.value})} placeholder="ID Empleado" />
                    <Input value={editedItem.nombre} onChange={(e) => setEditedItem({...editedItem, nombre: e.target.value})} placeholder="Nombre Completo" />
                    <Button variant="ghost" size="icon" onClick={handleSaveEdit}><Save className="h-4 w-4 text-green-600" /></Button>
                    <Button variant="ghost" size="icon" onClick={handleCancelEdit}><Ban className="h-4 w-4" /></Button>
                   </>
                ) : (
                  <>
                    <Input value={item.id} readOnly className="bg-muted" />
                    <Input value={item.nombre} readOnly className="bg-muted" />
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(index)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}><X className="h-4 w-4" /></Button>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 border-t pt-4">
            <Input
              name="id"
              placeholder="ID Empleado..."
              value={newItem.id}
              onChange={(e) => setNewItem({ ...newItem, id: e.target.value })}
              onKeyDown={handleKeyDown}
            />
             <Input
              name="nombre"
              placeholder="Nombre Completo..."
              value={newItem.nombre}
              onChange={(e) => setNewItem({ ...newItem, nombre: e.target.value })}
              onKeyDown={handleKeyDown}
            />
            <Button onClick={handleAddItem} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
