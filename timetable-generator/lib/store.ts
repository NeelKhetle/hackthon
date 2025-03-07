"use client"

import { create } from "zustand"

// Update the Subject interface to include practical information
interface Subject {
  id: string
  code: string
  name: string
  department: string
  credits: number
  requiredSessions: number
  hasPractical: boolean
  practicalDuration: number
  practicalSessionsPerWeek: number
}

interface Teacher {
  id: string
  code: string
  name: string
  department: string
  subjects: string[]
  maxHoursPerDay: number
  preferredTimeSlots: string[]
}

// Update the Room interface to include lab information
interface Room {
  id: string
  name: string
  capacity: number
  hasProjector: boolean
  hasComputers: boolean
  isLab: boolean
  labType: string
}

interface TimeSlot {
  id: string
  day: string
  startTime: string
  endTime: string
}

interface Constraints {
  maxConsecutiveLectures: number
  preferredStartTime: string
  preferredEndTime: string
  lunchBreakStart: string
  lunchBreakDuration: number
  balanceTeacherLoad: boolean
  minimizeRoomChanges: boolean
}

// Update the TimetableSession interface to include session type
interface TimetableSession {
  subjectId: string
  teacherId: string
  roomId: string
  isPractical?: boolean
}

interface Timetable {
  [day: string]: {
    [timeSlot: string]: TimetableSession[]
  }
  conflicts?: number
  utilization?: number
}

interface StoreState {
  subjects: Subject[]
  teachers: Teacher[]
  rooms: Room[]
  timeSlots: TimeSlot[]
  constraints: Constraints
  timetable: Timetable | null
  addSubject: (subject: Subject) => void
  addTeacher: (teacher: Teacher) => void
  addRoom: (room: Room) => void
  addTimeSlot: (timeSlot: TimeSlot) => void
  updateConstraints: (constraints: Constraints) => void
  setTimetable: (timetable: Timetable) => void
}

export const useStore = create<StoreState>((set) => ({
  subjects: [],
  teachers: [],
  rooms: [],
  timeSlots: [],
  constraints: {
    maxConsecutiveLectures: 3,
    preferredStartTime: "08:00",
    preferredEndTime: "17:00",
    lunchBreakStart: "12:00",
    lunchBreakDuration: 60,
    balanceTeacherLoad: true,
    minimizeRoomChanges: true,
  },
  timetable: null,

  addSubject: (subject) =>
    set((state) => ({
      subjects: [...state.subjects, subject],
    })),

  addTeacher: (teacher) =>
    set((state) => ({
      teachers: [...state.teachers, teacher],
    })),

  addRoom: (room) =>
    set((state) => ({
      rooms: [...state.rooms, room],
    })),

  addTimeSlot: (timeSlot) =>
    set((state) => ({
      timeSlots: [...state.timeSlots, timeSlot],
    })),

  updateConstraints: (constraints) =>
    set(() => ({
      constraints,
    })),

  setTimetable: (timetable) =>
    set(() => ({
      timetable,
    })),
}))

