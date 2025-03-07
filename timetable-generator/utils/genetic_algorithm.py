# utils/genetic_algorithm.py

from models.timetable import Timetable

def generate_timetable(subjects, teachers, rooms, time_slots):
    """
    Placeholder function for generating a timetable.
    Replace this with your actual implementation.
    """
    timetable = Timetable()

    # Example: Add a dummy session to the timetable
    if subjects and teachers and rooms and time_slots:
        session = {
            "subject": subjects[0],
            "teacher": teachers[0],
            "room": rooms[0],
            "time_slot": time_slots[0],
            "is_practical": False
        }
        timetable.add_session(time_slots[0].day, time_slots[0].start_time, session)

    return timetable