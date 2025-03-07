from flask import Flask, render_template, request, jsonify, send_file
from models.timetable import Subject, Teacher, Room, TimeSlot, Timetable
from utils.genetic_algorithm import generate_timetable
from utils.pdf_generator import generate_pdf
import csv
import io

app = Flask(__name__)

# In-memory storage (replace with a database in a production environment)
subjects = []
teachers = []
rooms = []
time_slots = []
timetable = None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/input_forms')
def input_forms():
    return render_template('input_forms.html')

@app.route('/batch_input')
def batch_input():
    return render_template('batch_input.html')

@app.route('/timetable_view')
def timetable_view():
    return render_template('timetable_view.html', timetable=timetable)

@app.route('/api/add_subject', methods=['POST'])
def add_subject():
    data = request.json
    subject = Subject(**data)
    subjects.append(subject)
    return jsonify({"message": "Subject added successfully"}), 201

@app.route('/api/add_teacher', methods=['POST'])
def add_teacher():
    data = request.json
    teacher = Teacher(**data)
    teachers.append(teacher)
    return jsonify({"message": "Teacher added successfully"}), 201

@app.route('/api/add_room', methods=['POST'])
def add_room():
    data = request.json
    room = Room(**data)
    rooms.append(room)
    return jsonify({"message": "Room added successfully"}), 201

@app.route('/api/add_time_slot', methods=['POST'])
def add_time_slot():
    data = request.json
    time_slot = TimeSlot(**data)
    time_slots.append(time_slot)
    return jsonify({"message": "Time slot added successfully"}), 201

@app.route('/api/generate_timetable', methods=['POST'])
def api_generate_timetable():
    global timetable
    timetable = generate_timetable(subjects, teachers, rooms, time_slots)
    return jsonify({"message": "Timetable generated successfully"}), 200

@app.route('/api/export_pdf')
def export_pdf():
    if not timetable:
        return jsonify({"error": "No timetable generated yet"}), 400
    
    pdf_buffer = generate_pdf(timetable)
    pdf_buffer.seek(0)
    
    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name="timetable.pdf",
        mimetype="application/pdf"
    )

@app.route('/api/export_csv')
def export_csv():
    if not timetable:
        return jsonify({"error": "No timetable generated yet"}), 400
    
    csv_buffer = io.StringIO()
    csv_writer = csv.writer(csv_buffer)
    
    # Write header
    csv_writer.writerow(["Day", "Time", "Subject", "Teacher", "Room", "Type"])
    
    # Write timetable data
    for day, slots in timetable.schedule.items():
        for time, sessions in slots.items():
            for session in sessions:
                csv_writer.writerow([
                    day,
                    time,
                    session.subject.name,
                    session.teacher.name,
                    session.room.name,
                    "Practical" if session.is_practical else "Lecture"
                ])
    
    csv_buffer.seek(0)
    return send_file(
        io.BytesIO(csv_buffer.getvalue().encode()),
        as_attachment=True,
        download_name="timetable.csv",
        mimetype="text/csv"
    )

if __name__ == '__main__':
    app.run(debug=True)

