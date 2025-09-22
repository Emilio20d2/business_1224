"use client";

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { analyzeWeeklyTrends, type AnalyzeWeeklyTrendsInput } from '@/ai/flows/analyze-weekly-trends';
import { useToast } from "@/hooks/use-toast";

type AIAnalysisProps = {
  input: AnalyzeWeeklyTrendsInput;
};

export function AIAnalysis({ input }: AIAnalysisProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalysis = () => {
    startTransition(async () => {
      try {
        const result = await analyzeWeeklyTrends(input);
        setAnalysis(result.analysis);
      } catch (error) {
        console.error("Error generating AI analysis:", error);
        toast({
          variant: "destructive",
          title: "Error de Análisis",
          description: "No se pudo generar el análisis. Por favor, inténtalo de nuevo.",
        });
        setAnalysis(null);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            <CardTitle>Análisis con IA</CardTitle>
          </div>
          <Button onClick={handleAnalysis} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              'Analizar Tendencias'
            )}
          </Button>
        </div>
      </CardHeader>
      {analysis && !isPending && (
        <CardContent>
          <div className="prose prose-sm max-w-none rounded-lg border bg-accent/20 p-4 text-foreground">
             <p>{analysis}</p>
          </div>
        </CardContent>
      )}
      {isPending && (
         <CardContent>
            <div className="space-y-2 rounded-lg border bg-accent/20 p-4">
                <div className="h-4 w-full animate-pulse rounded bg-muted-foreground/20"></div>
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted-foreground/20"></div>
                <div className="h-4 w-5/6 animate-pulse rounded bg-muted-foreground/20"></div>
            </div>
         </CardContent>
      )}
    </Card>
  );
}
