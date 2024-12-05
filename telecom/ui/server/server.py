from flask import Flask, request as req
from flask_cors import CORS
from markupsafe import escape
from misc import auth_user, insert_db, pop_last, predict_survey, verify_last
import smtplib
from email.message import EmailMessage

app=Flask(__name__)
CORS(app)

@app.route("/")
def index():
    return "Hello world"

@app.route('/login', methods=['POST'])
def login():
    if req.method == 'POST':
        return auth_user(req.form['user'], req.form['pwd'])
    else:
        return 'Wrong method'

@app.route('/join', methods=['POST'])
def join():
    if req.method == 'POST':
        return insert_db(req.form['user'], req.form['pwd'], req.form['email'])
    else:
        return 'Wrong method'

@app.route('/mail', methods=['POST'])
def mail_to():
    try:
        msg=EmailMessage()
        msg.set_content(f'Verification code: \r\n {req.form['code']}')
        msg['Subject']='Verification code'
        msg['From']='test@localhost'
        msg['To']=req.form['email']

        with smtplib.SMTP('localhost', 8025) as s:
            s.send_message(msg)
            s.quit()
    except Exception:
        return {'state':'error'}
    finally:
        return {'state':'sent'}

@app.route('/verify', methods=['POST', 'GET'])
def verify():
    if req.method == 'POST':
        return verify_last()
    elif req.method == 'GET':
        return pop_last()
    else:
        'Wrong method'

@app.route('/predict', methods=['POST'])
def predict():
    if req.method == 'POST':
        return predict_survey(req.get_json())
    else:
        return 'Wrong method'