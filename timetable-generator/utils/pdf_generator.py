# utils/pdf_generator.py

from fpdf import FPDF
import io

def generate_pdf(timetable):
    """
    Generates a PDF file from the timetable.
    """
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)

    # Add timetable data to the PDF
    for day, slots in timetable.schedule.items():
        pdf.cell(200, 10, txt=f"Day: {day}", ln=True)
        for time, sessions in slots.items():
            pdf.cell(200, 10, txt=f"Time: {time}", ln=True)
            for session in sessions:
                pdf.cell(200, 10, txt=f"Subject: {session['subject'].name}, Teacher: {session['teacher'].name}, Room: {session['room'].name}", ln=True)

    # Save the PDF to a buffer
    pdf_buffer = io.BytesIO()
    pdf.output(pdf_buffer)
    pdf_buffer.seek(0)
    return pdf_buffer