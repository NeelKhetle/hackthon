"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, Printer } from "lucide-react"
import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { toast } from "@/components/ui/use-toast"

export default function TimetableView() {
  const { timetable, subjects, teachers, rooms } = useStore()
  const [viewType, setViewType] = useState("master")
  const [selectedEntity, setSelectedEntity] = useState("")

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const timeSlots = [
    "08:00-09:00",
    "09:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-13:00",
    "13:00-14:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
  ]

  // Mock timetable data for demonstration
  const mockTimetable = {
    Monday: {
      "08:00-09:00": [{ subjectId: "CS101", teacherId: "T001", roomId: "R101" }],
      "09:00-10:00": [{ subjectId: "CS102", teacherId: "T002", roomId: "R102" }],
      "10:00-11:00": [{ subjectId: "CS103", teacherId: "T003", roomId: "R103" }],
      "11:00-12:00": [{ subjectId: "CS104", teacherId: "T001", roomId: "R104" }],
      "13:00-14:00": [{ subjectId: "CS105", teacherId: "T002", roomId: "R105" }],
      "14:00-15:00": [{ subjectId: "CS106", teacherId: "T003", roomId: "R106" }],
      "15:00-16:00": [{ subjectId: "CS107", teacherId: "T001", roomId: "R107" }],
    },
    Tuesday: {
      "08:00-09:00": [{ subjectId: "CS108", teacherId: "T002", roomId: "R108" }],
      "09:00-10:00": [{ subjectId: "CS109", teacherId: "T003", roomId: "R109" }],
      "10:00-11:00": [{ subjectId: "CS110", teacherId: "T001", roomId: "R110" }],
      "11:00-12:00": [{ subjectId: "CS111", teacherId: "T002", roomId: "R111" }],
      "13:00-14:00": [{ subjectId: "CS112", teacherId: "T003", roomId: "R112" }],
      "14:00-15:00": [{ subjectId: "CS113", teacherId: "T001", roomId: "R113" }],
      "15:00-16:00": [{ subjectId: "CS114", teacherId: "T002", roomId: "R114" }],
    },
    // Other days would follow the same pattern
  }

  // Use the actual timetable if available, otherwise use mock data
  const displayTimetable = timetable || mockTimetable

  const getSubjectName = (subjectId) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject ? subject.name : subjectId
  }

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find((t) => t.id === teacherId)
    return teacher ? teacher.name : teacherId
  }

  const getRoomName = (roomId) => {
    const room = rooms.find((r) => r.id === roomId)
    return room ? room.name : roomId
  }

  const filterTimetableByTeacher = (teacherId) => {
    const filtered = {}

    Object.keys(displayTimetable).forEach((day) => {
      filtered[day] = {}
      Object.keys(displayTimetable[day]).forEach((timeSlot) => {
        const sessions = displayTimetable[day][timeSlot].filter((session) => session.teacherId === teacherId)
        if (sessions.length > 0) {
          filtered[day][timeSlot] = sessions
        }
      })
    })

    return filtered
  }

  const filterTimetableByRoom = (roomId) => {
    const filtered = {}

    Object.keys(displayTimetable).forEach((day) => {
      filtered[day] = {}
      Object.keys(displayTimetable[day]).forEach((timeSlot) => {
        const sessions = displayTimetable[day][timeSlot].filter((session) => session.roomId === roomId)
        if (sessions.length > 0) {
          filtered[day][timeSlot] = sessions
        }
      })
    })

    return filtered
  }

  const getCurrentTimetable = () => {
    if (viewType === "master") {
      return displayTimetable
    } else if (viewType === "teacher" && selectedEntity) {
      return filterTimetableByTeacher(selectedEntity)
    } else if (viewType === "room" && selectedEntity) {
      return filterTimetableByRoom(selectedEntity)
    }
    return displayTimetable
  }

  const currentTimetable = getCurrentTimetable()

  const timetableRef = useRef(null)

  const exportTimetable = async (format) => {
    if (!timetable && !displayTimetable) {
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

    if (format === "pdf") {
      try {
        // Wait for any state updates to be reflected in the DOM
        await new Promise((resolve) => setTimeout(resolve, 100))

        if (!timetableRef.current) {
          throw new Error("Timetable element not found")
        }

        const element = timetableRef.current
        const canvas = await html2canvas(element, {
          scale: 1,
          useCORS: true,
          logging: false,
        })

        const imgData = canvas.toDataURL("image/png")

        // Create PDF of A4 size
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        })

        const imgProps = pdf.getImageProperties(imgData)
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
        pdf.save("timetable.pdf")

        toast({
          title: "Export complete",
          description: "Your timetable has been exported as PDF.",
        })
      } catch (error) {
        console.error("PDF export error:", error)
        toast({
          title: "Export failed",
          description: "There was an error exporting the timetable.",
          variant: "destructive",
        })
      }
    } else if (format === "csv") {
      // CSV export logic
      const csvContent = generateCSV(currentTimetable)
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", "timetable.csv")
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export complete",
        description: "Your timetable has been exported as CSV.",
      })
    }
  }

  const generateCSV = (timetable) => {
    let csvContent = "Day,Time,Subject,Teacher,Room,Type\n"

    Object.keys(timetable).forEach((day) => {
      if (day === "conflicts" || day === "utilization") return

      Object.keys(timetable[day]).forEach((timeSlot) => {
        timetable[day][timeSlot].forEach((session) => {
          const subject = getSubjectName(session.subjectId)
          const teacher = getTeacherName(session.teacherId)
          const room = getRoomName(session.roomId)
          const type = session.isPractical ? "Practical" : "Lecture"

          csvContent += `${day},${timeSlot},"${subject}","${teacher}","${room}",${type}\n`
        })
      })
    })

    return csvContent
  }

  const printTimetable = () => {
    // In a real app, this would open the print dialog
    window.print()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Timetable View</CardTitle>
          <CardDescription>View and export the generated timetable</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Tabs value={viewType} onValueChange={setViewType} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="master">Master Timetable</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher View</TabsTrigger>
                  <TabsTrigger value="room">Room View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {viewType !== "master" && (
              <div className="w-full md:w-64">
                <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                  <SelectTrigger>
                    <SelectValue placeholder={viewType === "teacher" ? "Select Teacher" : "Select Room"} />
                  </SelectTrigger>
                  <SelectContent>
                    {viewType === "teacher"
                      ? teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))
                      : rooms.map((room) => (
                          <SelectItem key={room.id} value={room.id}>
                            {room.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 mb-4">
            <Button variant="outline" size="sm" onClick={() => exportTimetable("pdf")}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportTimetable("csv")}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={printTimetable}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>

          <div className="overflow-x-auto" ref={timetableRef}>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-muted">Time / Day</th>
                  {days.map((day) => (
                    <th key={day} className="border p-2 bg-muted">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot) => (
                  <tr key={timeSlot}>
                    <td className="border p-2 font-medium bg-muted">{timeSlot}</td>
                    {days.map((day) => (
                      <td key={`${day}-${timeSlot}`} className="border p-2 min-w-[200px]">
                        {currentTimetable[day] && currentTimetable[day][timeSlot] ? (
                          <div className="space-y-2">
                            {currentTimetable[day][timeSlot].map((session, index) => (
                              <div
                                key={index}
                                className={`p-2 rounded-md ${
                                  session.isPractical ? "bg-amber-100 dark:bg-amber-900/30" : "bg-primary/10"
                                }`}
                              >
                                <div className="font-medium">
                                  {getSubjectName(session.subjectId)}
                                  {session.isPractical && (
                                    <span className="ml-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                                      LAB
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">{getTeacherName(session.teacherId)}</div>
                                <Badge variant="outline" className="mt-1">
                                  {getRoomName(session.roomId)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground text-sm">No class</div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

