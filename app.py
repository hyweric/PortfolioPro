from flask import Flask, render_template
from calculate_routes import calculate_bp

app = Flask(__name__)
app.register_blueprint(calculate_bp)

@app.route('/')
def home():
    return render_template('index.html')