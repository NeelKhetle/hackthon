import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Dashboard from "@/components/dashboard"
import InputForms from "@/components/input-forms"
import TimetableView from "@/components/timetable-view"
import BatchInput from "@/components/batch-input"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center mb-2 text-primary">AI-Powered College Timetable Generator</h1>
        <p className="text-center text-muted-foreground mb-8">
          Optimize your institution's schedule with advanced AI algorithms
        </p>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="input">Input Data</TabsTrigger>
            <TabsTrigger value="batch">Batch Input</TabsTrigger>
            <TabsTrigger value="timetable">View Timetable</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          <TabsContent value="input">
            <InputForms />
          </TabsContent>
          <TabsContent value="batch">
            <BatchInput />
          </TabsContent>
          <TabsContent value="timetable">
            <TimetableView />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </main>
  )
}

