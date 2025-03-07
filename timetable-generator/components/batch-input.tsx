"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, FileText, Upload } from "lucide-react"

export default function BatchInput() {
  const { toast } = useToast()
  const { addSubject, addTeacher, addRoom, addTimeSlot } = useStore()

  const [subjectsInput, setSubjectsInput] = useState("")
  const [teachersInput, setTeachersInput] = useState("")
  const [roomsInput, setRoomsInput] = useState("")
  const [timeSlotsInput, setTimeSlotsInput] = useState("")
  const [error, setError] = useState("")

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target.result
      switch (type) {
        case "subjects":
          setSubjectsInput(content)
          break
        case "teachers":
          setTeachersInput(content)
          break
        case "rooms":
          setRoomsInput(content)
          break
        case "timeSlots":
          setTimeSlotsInput(content)
          break
      }
    }
    reader.readAsText(file)
  }

  const parseSubjects = () => {
    try {
      setError("")
      const lines = subjectsInput.trim().split("\n")
      const subjects = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        // Expected format: code,name,department,credits,requiredSessions,hasPractical,practicalDuration,practicalSessionsPerWeek
        const parts = line.split(",").map((part) => part.trim())

        if (parts.length < 5) {
          throw new Error(`Line ${i + 1}: Not enough fields. Expected at least 5 fields.`)
        }

        const subject = {
          id: parts[0],
          code: parts[0],
          name: parts[1],
          department: parts[2],
          credits: Number.parseInt(parts[3]) || 3,
          requiredSessions: Number.parseInt(parts[4]) || 2,
          hasPractical: parts[5] === "true" || parts[5] === "1",
          practicalDuration: Number.parseInt(parts[6]) || 2,
          practicalSessionsPerWeek: Number.parseInt(parts[7]) || 1,
        }

        subjects.push(subject)
      }

      // Add all subjects
      subjects.forEach((subject) => addSubject(subject))

      toast({
        title: "Subjects imported",
        description: `Successfully imported ${subjects.length} subjects.`,
      })

      setSubjectsInput("")
    } catch (error) {
      setError(error.message)
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const parseTeachers = () => {
    try {
      setError("")
      const lines = teachersInput.trim().split("\n")
      const teachers = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        // Expected format: id,name,department,maxHoursPerDay,subjects
        const parts = line.split(",").map((part) => part.trim())

        if (parts.length < 4) {
          throw new Error(`Line ${i + 1}: Not enough fields. Expected at least 4 fields.`)
        }

        const teacher = {
          id: parts[0],
          name: parts[1],
          department: parts[2],
          maxHoursPerDay: Number.parseInt(parts[3]) || 6,
          subjects: parts.slice(4).filter(Boolean),
          preferredTimeSlots: [],
        }

        teachers.push(teacher)
      }

      // Add all teachers
      teachers.forEach((teacher) => addTeacher(teacher))

      toast({
        title: "Teachers imported",
        description: `Successfully imported ${teachers.length} teachers.`,
      })

      setTeachersInput("")
    } catch (error) {
      setError(error.message)
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const parseRooms = () => {
    try {
      setError("")
      const lines = roomsInput.trim().split("\n")
      const rooms = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        // Expected format: id,name,capacity,hasProjector,hasComputers,isLab,labType
        const parts = line.split(",").map((part) => part.trim())

        if (parts.length < 3) {
          throw new Error(`Line ${i + 1}: Not enough fields. Expected at least 3 fields.`)
        }

        const room = {
          id: parts[0],
          name: parts[1],
          capacity: Number.parseInt(parts[2]) || 30,
          hasProjector: parts[3] === "true" || parts[3] === "1",
          hasComputers: parts[4] === "true" || parts[4] === "1",
          isLab: parts[5] === "true" || parts[5] === "1",
          labType: parts[6] || "",
        }

        rooms.push(room)
      }

      // Add all rooms
      rooms.forEach((room) => addRoom(room))

      toast({
        title: "Rooms imported",
        description: `Successfully imported ${rooms.length} rooms.`,
      })

      setRoomsInput("")
    } catch (error) {
      setError(error.message)
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const parseTimeSlots = () => {
    try {
      setError("")
      const lines = timeSlotsInput.trim().split("\n")
      const timeSlots = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        // Expected format: day,startTime,endTime
        const parts = line.split(",").map((part) => part.trim())

        if (parts.length < 3) {
          throw new Error(`Line ${i + 1}: Not enough fields. Expected 3 fields.`)
        }

        const timeSlot = {
          id: `${parts[0]}-${parts[1]}-${parts[2]}`,
          day: parts[0],
          startTime: parts[1],
          endTime: parts[2],
        }

        timeSlots.push(timeSlot)
      }

      // Add all time slots
      timeSlots.forEach((timeSlot) => addTimeSlot(timeSlot))

      toast({
        title: "Time slots imported",
        description: `Successfully imported ${timeSlots.length} time slots.`,
      })

      setTimeSlotsInput("")
    } catch (error) {
      setError(error.message)
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Input</CardTitle>
        <CardDescription>Import multiple items at once using CSV format</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="subjects" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="timeslots">Time Slots</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Enter subjects in CSV format, one per line:</p>
                <p className="font-mono mt-1">
                  code,name,department,credits,requiredSessions,hasPractical,practicalDuration,practicalSessionsPerWeek
                </p>
                <p className="mt-1">Example: CS101,Introduction to Programming,Computer Science,3,2,true,2,1</p>
              </div>

              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={() => document.getElementById("subjects-file").click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
                <input
                  id="subjects-file"
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "subjects")}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSubjectsInput(
                      "CS101,Introduction to Programming,Computer Science,3,2,true,2,1\nMTH201,Calculus I,Mathematics,4,3,false,0,0\nPHY101,Physics I,Physics,4,2,true,3,1",
                    )
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Load Example
                </Button>
              </div>

              <Textarea
                placeholder="Enter subjects data..."
                value={subjectsInput}
                onChange={(e) => setSubjectsInput(e.target.value)}
                rows={10}
              />

              <Button onClick={parseSubjects} className="w-full">
                Import Subjects
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="teachers">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Enter teachers in CSV format, one per line:</p>
                <p className="font-mono mt-1">id,name,department,maxHoursPerDay,subject1,subject2,...</p>
                <p className="mt-1">Example: T001,Dr. John Smith,Computer Science,6,CS101,CS102</p>
              </div>

              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={() => document.getElementById("teachers-file").click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
                <input
                  id="teachers-file"
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "teachers")}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTeachersInput(
                      "T001,Dr. John Smith,Computer Science,6,CS101,CS102\nT002,Dr. Jane Doe,Mathematics,5,MTH201\nT003,Dr. Robert Johnson,Physics,4,PHY101",
                    )
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Load Example
                </Button>
              </div>

              <Textarea
                placeholder="Enter teachers data..."
                value={teachersInput}
                onChange={(e) => setTeachersInput(e.target.value)}
                rows={10}
              />

              <Button onClick={parseTeachers} className="w-full">
                Import Teachers
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="rooms">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Enter rooms in CSV format, one per line:</p>
                <p className="font-mono mt-1">id,name,capacity,hasProjector,hasComputers,isLab,labType</p>
                <p className="mt-1">Example: R101,Main Building Room 101,40,true,false,false,</p>
              </div>

              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={() => document.getElementById("rooms-file").click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
                <input
                  id="rooms-file"
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "rooms")}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRoomsInput(
                      "R101,Main Building Room 101,40,true,false,false,\nR102,Main Building Room 102,30,true,true,false,\nL001,Computer Lab 1,25,true,true,true,computer",
                    )
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Load Example
                </Button>
              </div>

              <Textarea
                placeholder="Enter rooms data..."
                value={roomsInput}
                onChange={(e) => setRoomsInput(e.target.value)}
                rows={10}
              />

              <Button onClick={parseRooms} className="w-full">
                Import Rooms
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="timeslots">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Enter time slots in CSV format, one per line:</p>
                <p className="font-mono mt-1">day,startTime,endTime</p>
                <p className="mt-1">Example: Monday,09:00,10:00</p>
              </div>

              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={() => document.getElementById("timeslots-file").click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV
                </Button>
                <input
                  id="timeslots-file"
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "timeSlots")}
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTimeSlotsInput(
                      "Monday,09:00,10:00\nMonday,10:00,11:00\nMonday,11:00,12:00\nMonday,13:00,14:00\nMonday,14:00,15:00\nTuesday,09:00,10:00\nTuesday,10:00,11:00",
                    )
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Load Example
                </Button>
              </div>

              <Textarea
                placeholder="Enter time slots data..."
                value={timeSlotsInput}
                onChange={(e) => setTimeSlotsInput(e.target.value)}
                rows={10}
              />

              <Button onClick={parseTimeSlots} className="w-full">
                Import Time Slots
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <p>Batch input allows you to quickly add multiple items at once. Use CSV format with one item per line.</p>
      </CardFooter>
    </Card>
  )
}

