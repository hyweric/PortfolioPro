from flask import Blueprint, request, jsonify, render_template
from shared import generate_resume_dict
calculate_bp = Blueprint('calculate', __name__)

@calculate_bp.route('/')
def home():
    return render_template('index.html')

@calculate_bp.route('/calculate', methods=['POST'])
def calculate():
    pgh = request.form.get('pgh')
    print(f"Received pgh: {pgh}")  # Debug print
    response = generate_resume_dict(pgh)
    print(f"Generated response: {response}")  # Debug print
    return jsonify(response)
    