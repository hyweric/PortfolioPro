from flask import Flask, request, jsonify, render_template
import math

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    x = float(request.form.get('x'))
    y = float(request.form.get('y'))
    len1 = float(request.form.get('len1'))
    len2 = float(request.form.get('len2'))

    kin1 = Kinematics()
    result = kin1.inverseKinematics(x, y, len1, len2)

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)