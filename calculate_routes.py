import fitz  # PyMuPDF
from flask import Flask, request, jsonify, render_template, Blueprint
import os
from shared import generate_resume_dict

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

calculate_bp = Blueprint('calculate', __name__)
@calculate_bp.route('/calculate', methods=['POST'])
def calculate():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['resume']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file.filename.endswith('.pdf'):
        resume_text = extract_text_from_pdf(file)
        response = generate_resume_dict(resume_text)
        return jsonify(response)
    else:
        return jsonify({'error': 'Invalid file type'}), 400

def extract_text_from_pdf(pdf_file):
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

if __name__ == '__main__':
    app.run(debug=True)