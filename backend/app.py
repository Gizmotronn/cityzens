import os
from flask import Flask, request#, jsonify, make_response
from dotenv import load_dotenv
import psycopg2
#import lightkurve as lk
#from thirdweb import ThirdwebSDK

load_dotenv()
app = Flask(__name__)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)
#proposalsSDK = ThirdwebSDK('goerli')

# PostgreSQL queries
CREATE_USERS_TABLE = (
    'CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, address TEXT);'
)
CREATE_PLANETS_TABLE = (
    """CREATE TABLE IF NOT EXISTS planets (user_id INTEGER, temperature REAL, date TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);"""
)
INSERT_USER_RETURN_ID = 'INSERT INTO users (address) VALUES (%s) RETURNING id;'
INSERT_PLANET = (
    'INSERT INTO planets (user_id, temperature, date) VALUES (%s, %s, %s);'
)

@app.route('/')
def index():
    return "Hello World"

# User Management
@app.post('/api/user')
def addUser():
    data = request.get_json()
    address = data['address']

    # Connect to the database
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(CREATE_USERS_TABLE)
            cursor.execute(INSERT_USER_RETURN_ID, (address,))
            user_id = cursor.fetchone()[0]

    return {'id': user_id, 'message': f"User {address} created"}, 201

#@app.route('/proposals')
#def getProposals():
    #contract = proposalsSDK.get_contract('0xCcaA1ABA77Bae6296D386C2F130c46FEc3E5A004')
    #proposals = contract.call("getProposals")
    #return proposals"""
