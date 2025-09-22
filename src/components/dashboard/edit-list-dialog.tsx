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
import { X, Plus } from "lucide-react";

type EditListDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: string[];
  onSave: (items: string[]) => void;
};

export function EditListDialog({ isOpen, onClose, title, items, onSave }: EditListDialogProps) {
  const [currentItems, setCurrentItems] = useState(items);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    setCurrentItems(items);
  }, [items]);

  const handleAddItem = () => {
    if (newItem.trim() && !currentItems.includes(newItem.trim())) {
      setCurrentItems([...currentItems, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (itemToRemove: string) => {
    setCurrentItems(currentItems.filter(item => item !== itemToRemove));
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {currentItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input value={item} readOnly className="bg-muted" />
                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Input
              placeholder="Añadir nuevo elemento..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
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
