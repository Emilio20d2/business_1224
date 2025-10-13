
"use client";

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
import { Label } from '@/components/ui/label';
import { Save } from "lucide-react";

type EditPresentacionDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  footerText: string;
  onSave: (newText: string) => void;
};

export function EditPresentacionDialog({ isOpen, onClose, footerText, onSave }: EditPresentacionDialogProps) {
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentText(footerText);
    }
  }, [footerText, isOpen]);

  const handleSave = () => {
    onSave(currentText);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Pie de Página de la Presentación</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
           <div className="grid w-full items-center gap-2">
            <Label htmlFor="footer-text">
              Texto del pie de página
            </Label>
            <Input
              id="footer-text"
              type="text"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              className="col-span-1"
            />
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
