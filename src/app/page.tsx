import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyDataTab } from "@/components/dashboard/weekly-data-tab";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background font-body">
      <header className="border-b bg-card p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-headline text-3xl font-bold text-primary">
            Insight Board
          </h1>
          <p className="text-muted-foreground" id="periodo-informe">
            Análisis de la semana actual
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl p-4 sm:p-6">
        <Tabs defaultValue="datos-semanales" className="w-full">
          <TabsList>
            <TabsTrigger value="datos-semanales">Datos Semanales</TabsTrigger>
          </TabsList>
          <TabsContent value="datos-semanales" className="mt-4">
            <WeeklyDataTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
