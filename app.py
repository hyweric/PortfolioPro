from flask import Flask, render_template, url_for, redirect, request, jsonify, Blueprint, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, login_user, LoginManager, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
import fitz
import os 
from shared import generate_resume_dict
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'secret'
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

import json

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    website_data = db.Column(db.Text, nullable=True)  # Store as JSON string

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def set_website_data(self, data):
        self.website_data = json.dumps(data)

    def get_website_data(self):
        return json.loads(self.website_data) if self.website_data else None


class RegisterForm(FlaskForm):
    username = StringField(validators=[InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})
    password = PasswordField(validators=[InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})
    submit = SubmitField('Register')

    def validate_username(self, username):
        existing_user_username = User.query.filter_by(username=username.data).first()
        if existing_user_username:
            raise ValidationError('That username already exists. Please choose a different one.')

class LoginForm(FlaskForm):
    username = StringField('username', validators=[InputRequired(), Length(min=4, max=20)], render_kw={"placeholder": "Username"})
    password = PasswordField('password', validators=[InputRequired(), Length(min=8, max=20)], render_kw={"placeholder": "Password"})
    submit = SubmitField('Login')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user)
            return redirect(url_for('dashboard'))
    return render_template('login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('login'))
    
    return render_template('register.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@login_manager.unauthorized_handler
def unauthorized():
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    if not current_user.is_authenticated:
        return redirect(url_for('login'))

    user = User.query.get(current_user.id)
    if not user:
        return redirect(url_for('login'))  

    website_data = user.get_website_data()

    if not website_data or 'content' not in website_data:
        return render_template('dashboardTwo.html')  # Render a different template

    content_dict = json.loads(website_data['content'])

    #print(website_data)
    #print("TESTING")
    #print(content_dict)

    return render_template('dashboard.html', website_data=website_data, content_dict=content_dict)

calculate_bp = Blueprint('calculate', __name__)

@calculate_bp.route('/download_resume', methods=['GET'])
@login_required
def download_resume():
    user = User.query.get(current_user.id)
    website_data = user.get_website_data()
    if not website_data or 'resume' not in website_data:
        return jsonify({'error': 'Resume not found'}), 404
    
    resume_filename = website_data['resume']
    return send_from_directory(app.config['upload folder'], resume_filename, as_attachment=True) # NEED TO CHANGE UPLOAD FOLDER TO WHEREVER THE RESUME FILE IS STORED IN THE SERVER


@app.route('/export_to_website', methods=['POST'])
@login_required
def export_to_website():
    data = request.get_json()['data']
    print("\n \n \n  ETW:", data)
    user = User.query.get(current_user.id)
    user.set_website_data(data)
    print("\n \n \n ETW2:", user.website_data)
    db.session.commit()
    return redirect(url_for('dashboard'))


@app.route('/<username>')
@login_required
def user_website(username):
    user = User.query.filter_by(username=username).first()
    if not user or not user.website_data:
        return redirect(url_for('login'))
    website_data = user.get_website_data()
    content_dict = json.loads(website_data['content'])
    if user and user.website_data:
        return render_template('user_website.html', website_data=user.website_data, content_dict=content_dict)
    return redirect(url_for('login'))


@calculate_bp.route('/calculate', methods=['POST'])
def calculate():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['resume']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file.filename.endswith('.pdf'): # just in case even though its taken care of by html input tag 
        resume_text = extract_text_from_pdf(file)
        response = generate_resume_dict(resume_text)
        return jsonify(response)
    else:
        return jsonify({'error': 'Invalid file type'}), 400

def extract_text_from_pdf(pdf_file): # from SO
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text

app.register_blueprint(calculate_bp, url_prefix='/')

if __name__ == "__main__":
    app.run(debug=True)