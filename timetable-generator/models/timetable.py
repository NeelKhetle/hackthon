# models/timetable.py

class Subject:
    def __init__(self, name, code, is_practical=False):
        self.name = name
        self.code = code
        self.is_practical = is_practical

class Teacher:
    def __init__(self, name, teacher_id):
        self.name = name
        self.teacher_id = teacher_id

class Room:
    def __init__(self, name, room_id, capacity):
        self.name = name
        self.room_id = room_id
        self.capacity = capacity

class TimeSlot:
    def __init__(self, day, start_time, end_time):
        self.day = day
        self.start_time = start_time
        self.end_time = end_time

class Timetable:
    def __init__(self):
        self.schedule = {}  # Format: {day: {time: [session1, session2, ...]}}

    def add_session(self, day, time, session):
        if day not in self.schedule:
            self.schedule[day] = {}
        if time not in self.schedule[day]:
            self.schedule[day][time] = []
        self.schedule[day][time].append(session)