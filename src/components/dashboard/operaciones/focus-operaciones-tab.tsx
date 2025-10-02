
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type FocusOperacionesTabProps = {
  text: string;
  isEditing: boolean;
  onTextChange: (value: string) => void;
};

export function FocusOperacionesTab({ text, isEditing, onTextChange }: FocusOperacionesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          Focus de Operaciones
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="min-h-[200px] text-base"
            placeholder="Escribe aquí los objetivos o el foco para Operaciones..."
          />
        ) : (
          <div className={cn("min-h-[200px] w-full whitespace-pre-wrap rounded-md border border-input bg-background/50 px-3 py-2 text-sm", !text && "text-muted-foreground")}>
            {text || "No hay notas para Operaciones. Activa el modo de edición para añadir texto."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
