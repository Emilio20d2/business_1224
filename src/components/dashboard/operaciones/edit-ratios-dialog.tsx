
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
import type { WeeklyData } from '@/lib/data';

type EditRatiosDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  ratios: WeeklyData['listas']['productividadRatio'];
  onSave: (ratios: WeeklyData['listas']['productividadRatio']) => void;
};

export function EditRatiosDialog({ isOpen, onClose, ratios, onSave }: EditRatiosDialogProps) {
  const [currentRatios, setCurrentRatios] = useState({ picking: 400, perchado: 80, confeccion: 120 });

  useEffect(() => {
    if (isOpen && ratios) {
      setCurrentRatios(ratios);
    }
  }, [ratios, isOpen]);
  
  const handleChange = (field: 'picking' | 'perchado' | 'confeccion', value: string) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
        setCurrentRatios(prev => ({ ...prev, [field]: numericValue }));
    }
  };

  const handleSave = () => {
    onSave(currentRatios);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Ratios de Productividad</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
           <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="ratio-confeccion" className="text-right">
              Ratio Confección (un/h)
            </Label>
            <Input
              id="ratio-confeccion"
              type="number"
              value={currentRatios.confeccion}
              onChange={(e) => handleChange('confeccion', e.target.value)}
              className="col-span-1"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="ratio-perchado" className="text-right">
              Ratio Perchado/Pelado (un/h)
            </Label>
            <Input
              id="ratio-perchado"
              type="number"
              value={currentRatios.perchado}
              onChange={(e) => handleChange('perchado', e.target.value)}
              className="col-span-1"
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="ratio-picking" className="text-right">
              Ratio Picking por bulto (un/h)
            </Label>
            <Input
              id="ratio-picking"
              type="number"
              value={currentRatios.picking}
              onChange={(e) => handleChange('picking', e.target.value)}
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
