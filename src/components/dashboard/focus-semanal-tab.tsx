
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

type FocusSemanalTabProps = {
  title?: string;
  icon?: React.ReactNode;
  text: string;
  isEditing: boolean;
  onTextChange: (value: string) => void;
  placeholder?: string;
};

export function FocusSemanalTab({ title = "Focus", icon = <ClipboardCheck className="h-5 w-5 text-primary" />, text, isEditing, onTextChange, placeholder = "Escribe aquí tus objetivos, notas o el foco para la semana..." }: FocusSemanalTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="min-h-[200px] text-base"
            placeholder={placeholder}
          />
        ) : (
          <div className={cn("min-h-[200px] w-full whitespace-pre-wrap rounded-md border border-input bg-background/50 px-3 py-2 text-sm", !text && "text-muted-foreground")}>
            {text || "No hay notas. Activa el modo de edición para añadir texto."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
