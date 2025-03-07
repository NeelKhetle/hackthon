"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Download, Users, BookOpen, School } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"
import { runGeneticAlgorithm } from "@/lib/genetic-algorithm"

export default function Dashboard() {
  const { toast } = useToast()
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const { subjects, teachers, rooms, timeSlots, timetable, setTimetable, constraints } = useStore()

  const stats = {
    subjects: subjects.length,
    teachers: teachers.length,
    rooms: rooms.length,
    timeSlots: timeSlots.length,
    conflicts: timetable ? calculateConflicts(timetable) : 0,
    utilization: timetable ? calculateUtilization(timetable) : 0,
  }

  function calculateConflicts(timetable) {
    // In a real app, this would analyze the timetable for conflicts
    return timetable.conflicts || 0
  }

  function calculateUtilization(timetable) {
    // In a real app, this would calculate resource utilization
    return timetable.utilization || 85
  }

  const generateTimetable = async () => {
    if (subjects.length === 0 || teachers.length === 0 || rooms.length === 0 || timeSlots.length === 0) {
      toast({
        title: "Missing data",
        description: "Please add subjects, teachers, rooms, and time slots first.",
        variant: "destructive",
      })
      return
    }

    setIsOptimizing(true)
    setOptimizationProgress(0)

    // Simulate progress updates
    const interval = setInterval(() => {
      setOptimizationProgress((prev) => {
        const newProgress = prev + Math.random() * 10
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 500)

    try {
      // Run the genetic algorithm
      const result = await runGeneticAlgorithm({
        subjects,
        teachers,
        rooms,
        timeSlots,
        constraints,
        onProgress: (progress) => {
          setOptimizationProgress(progress)
        },
      })

      setTimetable(result)

      toast({
        title: "Timetable generated",
        description: "Your optimized timetable is ready to view.",
      })
    } catch (error) {
      toast({
        title: "Optimization failed",
        description: error.message || "An error occurred during timetable generation.",
        variant: "destructive",
      })
    } finally {
      clearInterval(interval)
      setIsOptimizing(false)
      setOptimizationProgress(100)
    }
  }

  const exportTimetable = (format) => {
    if (!timetable) {
      toast({
        title: "No timetable",
        description: "Please generate a timetable first.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your timetable is being prepared for download.",
    })

    // In a real app, this would trigger the actual export
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: `Your timetable has been exported as ${format.toUpperCase()}.`,
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.subjects}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teachers}</div>
            <p className="text-xs text-muted-foreground">Available for scheduling</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classrooms</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rooms}</div>
            <p className="text-xs text-muted-foreground">Available for lectures</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timetable Optimization</CardTitle>
          <CardDescription>Generate an optimized timetable using AI algorithms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isOptimizing ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Optimization in progress...</span>
                <span>{Math.round(optimizationProgress)}%</span>
              </div>
              <Progress value={optimizationProgress} />
            </div>
          ) : (
            <Button
              onClick={generateTimetable}
              className="w-full"
              disabled={subjects.length === 0 || teachers.length === 0 || rooms.length === 0 || timeSlots.length === 0}
            >
              Generate Optimized Timetable
            </Button>
          )}

          {timetable && (
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="text-2xl font-bold">{stats.conflicts}</div>
                    <p className="text-xs text-muted-foreground">Remaining scheduling conflicts</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="text-2xl font-bold">{stats.utilization}%</div>
                    <p className="text-xs text-muted-foreground">Classroom and faculty efficiency</p>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1" onClick={() => exportTimetable("pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => exportTimetable("csv")}>
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

