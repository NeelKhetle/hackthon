"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useStore } from "@/lib/store"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

export default function InputForms() {
  const { toast } = useToast()
  const {
    subjects,
    addSubject,
    teachers,
    addTeacher,
    rooms,
    addRoom,
    timeSlots,
    addTimeSlot,
    constraints,
    updateConstraints,
  } = useStore()

  // Subject form state
  const [subjectForm, setSubjectForm] = useState({
    code: "",
    name: "",
    department: "",
    credits: 3,
    requiredSessions: 2,
    hasPractical: false,
    practicalDuration: 2,
    practicalSessionsPerWeek: 1,
  })

  // Teacher form state
  const [teacherForm, setTeacherForm] = useState({
    id: "",
    name: "",
    department: "",
    subjects: [],
    maxHoursPerDay: 6,
    preferredTimeSlots: [],
  })

  // Room form state
  const [roomForm, setRoomForm] = useState({
    id: "",
    name: "",
    capacity: 30,
    hasProjector: false,
    hasComputers: false,
    isLab: false,
    labType: "",
  })

  // Time slot form state
  const [timeSlotForm, setTimeSlotForm] = useState({
    id: "",
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
  })

  // Constraints form state
  const [constraintForm, setConstraintForm] = useState({
    maxConsecutiveLectures: constraints.maxConsecutiveLectures || 3,
    preferredStartTime: constraints.preferredStartTime || "08:00",
    preferredEndTime: constraints.preferredEndTime || "17:00",
    lunchBreakStart: constraints.lunchBreakStart || "12:00",
    lunchBreakDuration: constraints.lunchBreakDuration || 60,
    balanceTeacherLoad: constraints.balanceTeacherLoad || true,
    minimizeRoomChanges: constraints.minimizeRoomChanges || true,
  })

  const handleSubjectSubmit = (e) => {
    e.preventDefault()
    if (!subjectForm.code || !subjectForm.name) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    addSubject({
      ...subjectForm,
      id: subjectForm.code,
    })

    toast({
      title: "Subject added",
      description: `${subjectForm.name} has been added to the subjects list.`,
    })

    setSubjectForm({
      code: "",
      name: "",
      department: "",
      credits: 3,
      requiredSessions: 2,
      hasPractical: false,
      practicalDuration: 2,
      practicalSessionsPerWeek: 1,
    })
  }

  const handleTeacherSubmit = (e) => {
    e.preventDefault()
    if (!teacherForm.id || !teacherForm.name) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    addTeacher({
      ...teacherForm,
    })

    toast({
      title: "Teacher added",
      description: `${teacherForm.name} has been added to the faculty list.`,
    })

    setTeacherForm({
      id: "",
      name: "",
      department: "",
      subjects: [],
      maxHoursPerDay: 6,
      preferredTimeSlots: [],
    })
  }

  const handleRoomSubmit = (e) => {
    e.preventDefault()
    if (!roomForm.id || !roomForm.name) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    addRoom({
      ...roomForm,
    })

    toast({
      title: "Room added",
      description: `${roomForm.name} has been added to the rooms list.`,
    })

    setRoomForm({
      id: "",
      name: "",
      capacity: 30,
      hasProjector: false,
      hasComputers: false,
      isLab: false,
      labType: "",
    })
  }

  const handleTimeSlotSubmit = (e) => {
    e.preventDefault()
    if (!timeSlotForm.day || !timeSlotForm.startTime || !timeSlotForm.endTime) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const id = `${timeSlotForm.day}-${timeSlotForm.startTime}-${timeSlotForm.endTime}`

    addTimeSlot({
      ...timeSlotForm,
      id,
    })

    toast({
      title: "Time slot added",
      description: `${timeSlotForm.day} ${timeSlotForm.startTime}-${timeSlotForm.endTime} has been added.`,
    })

    setTimeSlotForm({
      id: "",
      day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
    })
  }

  const handleConstraintsSubmit = (e) => {
    e.preventDefault()

    updateConstraints({
      ...constraintForm,
    })

    toast({
      title: "Constraints updated",
      description: "Timetable constraints have been updated successfully.",
    })
  }

  return (
    <Tabs defaultValue="subjects" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="subjects">Subjects</TabsTrigger>
        <TabsTrigger value="teachers">Teachers</TabsTrigger>
        <TabsTrigger value="rooms">Rooms</TabsTrigger>
        <TabsTrigger value="timeslots">Time Slots</TabsTrigger>
        <TabsTrigger value="constraints">Constraints</TabsTrigger>
      </TabsList>

      <TabsContent value="subjects">
        <Card>
          <CardHeader>
            <CardTitle>Add Subject</CardTitle>
            <CardDescription>Enter the details of the course or subject to be scheduled</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubjectSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-code">Subject Code</Label>
                  <Input
                    id="subject-code"
                    placeholder="CS101"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-name">Subject Name</Label>
                  <Input
                    id="subject-name"
                    placeholder="Introduction to Computer Science"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-department">Department</Label>
                  <Input
                    id="subject-department"
                    placeholder="Computer Science"
                    value={subjectForm.department}
                    onChange={(e) => setSubjectForm({ ...subjectForm, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-credits">Credits</Label>
                  <Input
                    id="subject-credits"
                    type="number"
                    min="1"
                    max="6"
                    value={subjectForm.credits}
                    onChange={(e) => setSubjectForm({ ...subjectForm, credits: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject-sessions">Required Sessions per Week</Label>
                  <Input
                    id="subject-sessions"
                    type="number"
                    min="1"
                    max="10"
                    value={subjectForm.requiredSessions}
                    onChange={(e) =>
                      setSubjectForm({ ...subjectForm, requiredSessions: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="subject-practical"
                    checked={subjectForm.hasPractical}
                    onCheckedChange={(checked) => setSubjectForm({ ...subjectForm, hasPractical: !!checked })}
                  />
                  <Label htmlFor="subject-practical">Has Practical/Lab Component</Label>
                </div>
              </div>

              {subjectForm.hasPractical && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="practical-duration">Practical Duration (hours)</Label>
                    <Input
                      id="practical-duration"
                      type="number"
                      min="1"
                      max="4"
                      value={subjectForm.practicalDuration}
                      onChange={(e) =>
                        setSubjectForm({ ...subjectForm, practicalDuration: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="practical-sessions">Practical Sessions per Week</Label>
                    <Input
                      id="practical-sessions"
                      type="number"
                      min="1"
                      max="3"
                      value={subjectForm.practicalSessionsPerWeek}
                      onChange={(e) =>
                        setSubjectForm({ ...subjectForm, practicalSessionsPerWeek: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  setSubjectForm({
                    code: "",
                    name: "",
                    department: "",
                    credits: 3,
                    requiredSessions: 2,
                    hasPractical: false,
                    practicalDuration: 2,
                    practicalSessionsPerWeek: 1,
                  })
                }
              >
                Reset
              </Button>
              <Button type="submit">Add Subject</Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Added Subjects ({subjects.length})</h3>
          {subjects.length > 0 ? (
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Code</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Credits</th>
                    <th className="px-4 py-2 text-left">Sessions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject.id} className="border-b">
                      <td className="px-4 py-2">{subject.code}</td>
                      <td className="px-4 py-2">{subject.name}</td>
                      <td className="px-4 py-2">{subject.department}</td>
                      <td className="px-4 py-2">{subject.credits}</td>
                      <td className="px-4 py-2">{subject.requiredSessions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No subjects added yet.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="teachers">
        <Card>
          <CardHeader>
            <CardTitle>Add Teacher</CardTitle>
            <CardDescription>Enter the details of faculty members available for teaching</CardDescription>
          </CardHeader>
          <form onSubmit={handleTeacherSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-id">Teacher ID</Label>
                  <Input
                    id="teacher-id"
                    placeholder="T001"
                    value={teacherForm.id}
                    onChange={(e) => setTeacherForm({ ...teacherForm, id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-name">Full Name</Label>
                  <Input
                    id="teacher-name"
                    placeholder="Dr. John Smith"
                    value={teacherForm.name}
                    onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacher-department">Department</Label>
                  <Input
                    id="teacher-department"
                    placeholder="Computer Science"
                    value={teacherForm.department}
                    onChange={(e) => setTeacherForm({ ...teacherForm, department: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-max-hours">Max Hours Per Day</Label>
                  <Input
                    id="teacher-max-hours"
                    type="number"
                    min="1"
                    max="10"
                    value={teacherForm.maxHoursPerDay}
                    onChange={(e) =>
                      setTeacherForm({ ...teacherForm, maxHoursPerDay: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subjects Qualified to Teach</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`subject-${subject.id}`}
                        checked={teacherForm.subjects.includes(subject.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTeacherForm({
                              ...teacherForm,
                              subjects: [...teacherForm.subjects, subject.id],
                            })
                          } else {
                            setTeacherForm({
                              ...teacherForm,
                              subjects: teacherForm.subjects.filter((id) => id !== subject.id),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={`subject-${subject.id}`}>{subject.name}</Label>
                    </div>
                  ))}
                </div>
                {subjects.length === 0 && (
                  <p className="text-sm text-muted-foreground">No subjects available. Please add subjects first.</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  setTeacherForm({
                    id: "",
                    name: "",
                    department: "",
                    subjects: [],
                    maxHoursPerDay: 6,
                    preferredTimeSlots: [],
                  })
                }
              >
                Reset
              </Button>
              <Button type="submit">Add Teacher</Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Added Teachers ({teachers.length})</h3>
          {teachers.length > 0 ? (
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Max Hours</th>
                    <th className="px-4 py-2 text-left">Subjects</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b">
                      <td className="px-4 py-2">{teacher.id}</td>
                      <td className="px-4 py-2">{teacher.name}</td>
                      <td className="px-4 py-2">{teacher.department}</td>
                      <td className="px-4 py-2">{teacher.maxHoursPerDay}</td>
                      <td className="px-4 py-2">
                        {teacher.subjects
                          .map((subjectId) => {
                            const subject = subjects.find((s) => s.id === subjectId)
                            return subject ? subject.name : subjectId
                          })
                          .join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No teachers added yet.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="rooms">
        <Card>
          <CardHeader>
            <CardTitle>Add Room</CardTitle>
            <CardDescription>Enter the details of classrooms available for scheduling</CardDescription>
          </CardHeader>
          <form onSubmit={handleRoomSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room-id">Room ID</Label>
                  <Input
                    id="room-id"
                    placeholder="R101"
                    value={roomForm.id}
                    onChange={(e) => setRoomForm({ ...roomForm, id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-name">Room Name</Label>
                  <Input
                    id="room-name"
                    placeholder="Main Building Room 101"
                    value={roomForm.name}
                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room-capacity">Capacity</Label>
                  <Input
                    id="room-capacity"
                    type="number"
                    min="1"
                    max="500"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="room-projector"
                    checked={roomForm.hasProjector}
                    onCheckedChange={(checked) => setRoomForm({ ...roomForm, hasProjector: !!checked })}
                  />
                  <Label htmlFor="room-projector">Has Projector</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="room-computers"
                    checked={roomForm.hasComputers}
                    onCheckedChange={(checked) => setRoomForm({ ...roomForm, hasComputers: !!checked })}
                  />
                  <Label htmlFor="room-computers">Has Computers</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="room-lab"
                  checked={roomForm.isLab}
                  onCheckedChange={(checked) => setRoomForm({ ...roomForm, isLab: !!checked })}
                />
                <Label htmlFor="room-lab">Is Laboratory</Label>
              </div>

              {roomForm.isLab && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="lab-type">Laboratory Type</Label>
                  <Select
                    value={roomForm.labType}
                    onValueChange={(value) => setRoomForm({ ...roomForm, labType: value })}
                  >
                    <SelectTrigger id="lab-type">
                      <SelectValue placeholder="Select lab type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer">Computer Lab</SelectItem>
                      <SelectItem value="physics">Physics Lab</SelectItem>
                      <SelectItem value="chemistry">Chemistry Lab</SelectItem>
                      <SelectItem value="biology">Biology Lab</SelectItem>
                      <SelectItem value="engineering">Engineering Lab</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  setRoomForm({
                    id: "",
                    name: "",
                    capacity: 30,
                    hasProjector: false,
                    hasComputers: false,
                    isLab: false,
                    labType: "",
                  })
                }
              >
                Reset
              </Button>
              <Button type="submit">Add Room</Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Added Rooms ({rooms.length})</h3>
          {rooms.length > 0 ? (
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Capacity</th>
                    <th className="px-4 py-2 text-left">Projector</th>
                    <th className="px-4 py-2 text-left">Computers</th>
                    <th className="px-4 py-2 text-left">Lab Type</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id} className="border-b">
                      <td className="px-4 py-2">{room.id}</td>
                      <td className="px-4 py-2">{room.name}</td>
                      <td className="px-4 py-2">{room.capacity}</td>
                      <td className="px-4 py-2">{room.hasProjector ? "Yes" : "No"}</td>
                      <td className="px-4 py-2">{room.hasComputers ? "Yes" : "No"}</td>
                      <td className="px-4 py-2">{room.isLab ? room.labType || "General Lab" : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No rooms added yet.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="timeslots">
        <Card>
          <CardHeader>
            <CardTitle>Add Time Slot</CardTitle>
            <CardDescription>Define the available time slots for scheduling classes</CardDescription>
          </CardHeader>
          <form onSubmit={handleTimeSlotSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timeslot-day">Day</Label>
                  <Select
                    value={timeSlotForm.day}
                    onValueChange={(value) => setTimeSlotForm({ ...timeSlotForm, day: value })}
                  >
                    <SelectTrigger id="timeslot-day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                      <SelectItem value="Friday">Friday</SelectItem>
                      <SelectItem value="Saturday">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeslot-start">Start Time</Label>
                  <Input
                    id="timeslot-start"
                    type="time"
                    value={timeSlotForm.startTime}
                    onChange={(e) => setTimeSlotForm({ ...timeSlotForm, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeslot-end">End Time</Label>
                  <Input
                    id="timeslot-end"
                    type="time"
                    value={timeSlotForm.endTime}
                    onChange={(e) => setTimeSlotForm({ ...timeSlotForm, endTime: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() =>
                  setTimeSlotForm({
                    id: "",
                    day: "Monday",
                    startTime: "09:00",
                    endTime: "10:00",
                  })
                }
              >
                Reset
              </Button>
              <Button type="submit">Add Time Slot</Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Added Time Slots ({timeSlots.length})</h3>
          {timeSlots.length > 0 ? (
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Day</th>
                    <th className="px-4 py-2 text-left">Start Time</th>
                    <th className="px-4 py-2 text-left">End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot.id} className="border-b">
                      <td className="px-4 py-2">{slot.day}</td>
                      <td className="px-4 py-2">{slot.startTime}</td>
                      <td className="px-4 py-2">{slot.endTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No time slots added yet.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="constraints">
        <Card>
          <CardHeader>
            <CardTitle>Timetable Constraints</CardTitle>
            <CardDescription>Define the constraints and preferences for timetable generation</CardDescription>
          </CardHeader>
          <form onSubmit={handleConstraintsSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max-consecutive">Maximum Consecutive Lectures</Label>
                <div className="flex items-center space-x-4">
                  <Slider
                    id="max-consecutive"
                    min={1}
                    max={6}
                    step={1}
                    value={[constraintForm.maxConsecutiveLectures]}
                    onValueChange={(value) =>
                      setConstraintForm({ ...constraintForm, maxConsecutiveLectures: value[0] })
                    }
                    className="flex-1"
                  />
                  <span className="w-12 text-center">{constraintForm.maxConsecutiveLectures}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferred-start">Preferred Start Time</Label>
                  <Input
                    id="preferred-start"
                    type="time"
                    value={constraintForm.preferredStartTime}
                    onChange={(e) => setConstraintForm({ ...constraintForm, preferredStartTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferred-end">Preferred End Time</Label>
                  <Input
                    id="preferred-end"
                    type="time"
                    value={constraintForm.preferredEndTime}
                    onChange={(e) => setConstraintForm({ ...constraintForm, preferredEndTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lunch-start">Lunch Break Start</Label>
                  <Input
                    id="lunch-start"
                    type="time"
                    value={constraintForm.lunchBreakStart}
                    onChange={(e) => setConstraintForm({ ...constraintForm, lunchBreakStart: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lunch-duration">Lunch Break Duration (minutes)</Label>
                  <Input
                    id="lunch-duration"
                    type="number"
                    min="30"
                    max="120"
                    step="15"
                    value={constraintForm.lunchBreakDuration}
                    onChange={(e) =>
                      setConstraintForm({ ...constraintForm, lunchBreakDuration: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="balance-load"
                    checked={constraintForm.balanceTeacherLoad}
                    onCheckedChange={(checked) =>
                      setConstraintForm({ ...constraintForm, balanceTeacherLoad: !!checked })
                    }
                  />
                  <Label htmlFor="balance-load">Balance Teacher Workload</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="minimize-changes"
                    checked={constraintForm.minimizeRoomChanges}
                    onCheckedChange={(checked) =>
                      setConstraintForm({ ...constraintForm, minimizeRoomChanges: !!checked })
                    }
                  />
                  <Label htmlFor="minimize-changes">Minimize Room Changes for Consecutive Classes</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Save Constraints
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

