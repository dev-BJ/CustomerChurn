from pandas import *
import pickle
import json
import os.path as os_p
import numpy as np
from sklearn.calibration import LabelEncoder

DB_FILE='db.pkl'
PRED_FILE='../../churn.pkl'

db = {}
model = None;

label_encoder = LabelEncoder()

if os_p.exists(DB_FILE):
    with open(DB_FILE, 'rb') as db_w:
        db = pickle.load(db_w)
else:
    db = {
    'user':[],
    'pwd':[],
    'email':[],
    'verified':[]
}
    
def insert_db(user, pwd, email):
    new_user={'user': user, 'pwd': pwd, 'email': email, 'verified': False}

    if user in db['user'] or email in db['email']:
        return {'state':'exists'}
    else:
        db['user'].append(new_user['user'])
        db['pwd'].append(new_user['pwd'])
        db['email'].append(new_user['email'])
        db['verified'].append(False)
        # with open('db.pkl', 'wb') as db_w:
        #     pickle.dump(db, db_w)
        print(db)

    return {'state':'saved', 'email':email}

def pop_last():
    for i in db:
        db[i].pop(len(db[i])-1)
        # print(db[i])
    return True

def verify_last():
    db['verified'][len(db['verified'])-1]=True
    with open('db.pkl', 'wb') as db_w:
            pickle.dump(db, db_w)
    # print({'user': db['user'][len(db['user'])-1]})
    return {'user': db['user'][len(db['user'])-1]}

def auth_user(user, pwd):
    if user in db['user'] and pwd in db['pwd']:
        return {'state': True, 'user': user}
    else:
        return {'state': False}
    
def predict_survey(df):
    df = DataFrame(df, dtype=np.int64)
    survey_df = DataFrame({})
    # print(survey_df)
    # return 'Testing'
    
    survey_df['account_length'] = df['acc_len']
    survey_df['international_plan'] = df['intl_plan']
    survey_df['number_vmail_messages'] = df['vmail_msg']
    survey_df['total_day_minutes'] = df['day_min']
    survey_df['total_day_calls'] = df['day_calls']
    survey_df['total_day_charge'] = df['day_charge']
    survey_df['total_eve_minutes'] = df['eve_min']
    survey_df['total_eve_calls'] = df['eve_calls']
    survey_df['total_eve_charge'] = df['eve_charge']
    survey_df['total_night_minutes'] = df['night_min']
    survey_df['total_night_calls'] = df['night_calls']
    survey_df['total_night_charge'] = df['night_charge']
    survey_df['total_intl_minutes'] = df['intl_min']
    survey_df['total_intl_calls'] = df['intl_calls']
    survey_df['total_intl_charge'] = df['intl_charge']
    survey_df['customer_service_calls'] = df['cus_calls']

    # print(survey_df)
    # return 'working'

    with open(PRED_FILE, 'rb') as pred_f:
        model = pickle.load(pred_f)
        pred_f.close()
    
    # for col in survey_df.columns:
    #     # print(col)
    #     survey_df[col]=label_encoder.fit_transform(survey_df[col])
    print(survey_df)
    pred = model.predict(survey_df)

    if pred == 1:
        return {'churn': True}
    elif pred == 0:
        return {'churn': False}
    else:
        return 'error'
    # return {'churn': pred[0]}