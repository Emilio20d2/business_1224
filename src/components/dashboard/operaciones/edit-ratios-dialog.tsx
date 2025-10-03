
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
  const [currentRatios, setCurrentRatios] = useState({ picking: 400, perchado: 80, confeccion: 120, porcentajePerchado: 40, porcentajePicking: 60 });

  useEffect(() => {
    if (isOpen && ratios) {
      setCurrentRatios({
        picking: ratios.picking || 400,
        perchado: ratios.perchado || 80,
        confeccion: ratios.confeccion || 120,
        porcentajePerchado: ratios.porcentajePerchado || 40,
        porcentajePicking: ratios.porcentajePicking || 60,
      });
    }
  }, [ratios, isOpen]);
  
  const handleRatioChange = (field: 'picking' | 'perchado' | 'confeccion', value: string) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
        setCurrentRatios(prev => ({ ...prev, [field]: numericValue }));
    }
  };

  const handlePercentageChange = (field: 'porcentajePerchado' | 'porcentajePicking', value: string) => {
    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100) {
      if (field === 'porcentajePerchado') {
        setCurrentRatios({
          ...currentRatios,
          porcentajePerchado: numericValue,
          porcentajePicking: 100 - numericValue,
        });
      } else {
        setCurrentRatios({
          ...currentRatios,
          porcentajePicking: numericValue,
          porcentajePerchado: 100 - numericValue,
        });
      }
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
              onChange={(e) => handleRatioChange('confeccion', e.target.value)}
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
              onChange={(e) => handleRatioChange('perchado', e.target.value)}
              className="col-span-1"
            />
          </div>
           <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="porcentaje-perchado" className="text-right">
              Porcentaje Perchado (%)
            </Label>
            <Input
              id="porcentaje-perchado"
              type="number"
              value={currentRatios.porcentajePerchado}
              onChange={(e) => handlePercentageChange('porcentajePerchado', e.target.value)}
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
              onChange={(e) => handleRatioChange('picking', e.target.value)}
              className="col-span-1"
            />
          </div>
           <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="porcentaje-picking" className="text-right">
              Porcentaje Picking (%)
            </Label>
            <Input
              id="porcentaje-picking"
              type="number"
              value={currentRatios.porcentajePicking}
              onChange={(e) => handlePercentageChange('porcentajePicking', e.target.value)}
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
